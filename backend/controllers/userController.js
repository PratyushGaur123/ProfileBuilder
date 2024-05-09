const jwt = require('jsonwebtoken');
const User = require('../models/user');
const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const zod = require('zod');
const userMailer = require('../mailers/userMailer');
const crypto = require('crypto');
const moment = require('moment');
const saltRounds = 10;
const emailRegex = /^([a-zA-Z0-9_.+-]+)@(gmail\.com|yahoo\.com|outlook\.com|rediffmail\.com)$/;

const signInSchema = zod.object({
    email: zod.string().email().regex(emailRegex, 'Email must be from Gmail, Yahoo, Outlook, or Rediffmail'),
    password: zod.string().min(8, 'Password must be at least 8 characters long').max(20, 'Password must be at most 20 characters long')
});

const signUpSchema = zod.object({
    firstName: zod.string().min(3, 'First name must be at least 3 characters long').max(20, 'First name must be at most 20 characters long'),
    lastName: zod.string().min(3, 'Last name must be at least 3 characters long').max(20, 'Last name must be at most 20 characters long'),
    email: zod.string().email().regex(emailRegex, 'Email must be from Gmail, Yahoo, Outlook, or Rediffmail'),
    password: zod.string().min(8, 'Password must be at least 8 characters long').max(20, 'Password must be at most 20 characters long'),
    gender: zod.enum(["Male", "Female"], 'Gender must be either Male or Female'),
    dateOfBirth: zod.date().min(new Date('1960-01-01'), { message: "Date of Birth cannot be before 1 Jan 1960" })
        .max(new Date('2006-12-31'), { message: "Date of Birth cannot be after 31 Dec 2006" }),
});

const emailValidationSchema = zod.object({
    email: zod.string().email().regex(emailRegex, 'Email must be from Gmail, Yahoo, Outlook, or Rediffmail')
});

const passwordValidationSchema = zod.object({
    password: zod.string().min(8, 'Password must be at least 8 characters long').max(20, 'Password must be at most 20 characters long')
});


// function to check if an email is a valid email or not
function isValidEmail(email) {
    try {
        emailValidationSchema.parse({ email });
        return true;
    } catch (error) {
        return false;
    }
}

function isValidPassword(password) {
    try {
        passwordValidationSchema.parse({ password });
        return true;
    } catch (error) {
        return false;
    }
}

function generateOTP() {
    const otp = crypto.randomInt(100000, 999999);
    return otp.toString();
}


/* Sign Up Controller */

module.exports.signUp = async function (req, res) {
    // converting the date from string to date object
    const dateOfBirth = new Date(req.body.dateOfBirth);

    if (isNaN(dateOfBirth.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }
    const response = signUpSchema.safeParse({
        ...req.body,
        dateOfBirth
    });

    if (!response.success) {
        const message = response.error.errors[0].message;
        return res.status(400).json({ message });
    }

    try {
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // check if the user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // const formattedDate = dateOfBirth.toISOString().split('T')[0];

        // create a new user
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth
        });

        userMailer.welcomeMail(newUser);

        return res.status(200).json(
            {
                message: 'Sign up successful please sign in',
                data: {
                    id: newUser.id
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while creating user' });
    }
}




/* Three controllers for signing in: one for password and the other two for sending and verifying the otp respectively */

module.exports.signInPassword = async function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Please send the input' });
    }

    const response = signInSchema.safeParse(req.body);
    if (!response.success) {
        const message = response.error.errors[0].message;
        return res.status(400).json({ message });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.CODEIAL_JWT_SECRET, { expiresIn: '1h' });
        const userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            verified: user.verified
        };
        return res.status(200).json(
            {
                message: 'Sign in successful',
                data: {
                    token,
                    user: userInfo
                }
            });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while signing in' });
    }
}

module.exports.signInSendOTP = async function (req, res) {
    try {
        const email = req.body.email;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("user not found in db");
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'User not verified' });
        }

        const otp = generateOTP();
        const otpExist = await OTP.findOne({ user: user._id });
        if (otpExist) {
            // if otp already exists for the user, update it with the new one
            const updateOTP = await OTP.updateOne({ user: user._id }, { $set: { otp: otp } });
        }else{
            const savedOTP = await OTP.create({
                user: user._id,
                otp: otp
            });
        }

        const subject = 'OTP for Sign-In'

        userMailer.sendOTP(user, otp, subject);

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while sending OTP' });
    }
}

module.exports.signInVerifyOTP = async function (req, res) {
    try {
        const { otp, email } = req.body;
        if (!email || !isValidEmail(email) || !otp || otp.length !== 6) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpDoc = await OTP.findOne({ user: user._id });

        if (!otpDoc) {
            return res.status(410).json({ message: 'OTP expired' });
        }

        if (otp !== otpDoc.otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        } else {
            //deleting the otp and creating a jwt token
            const deleteOtp = await OTP.deleteOne({ user: user._id });
            const token = jwt.sign({ email: user.email, id: user._id }, process.env.CODEIAL_JWT_SECRET, { expiresIn: '1h' });
            const userInfo = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                verified: user.verified
            };
            return res.status(200).json({
                message: 'OTP verified successfully',
                data: {
                    token,
                    user: userInfo
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}




/* Two controllers for sending the verifying verification link */

module.exports.sendLink = async function (req, res) {
    try {
        if (!req.user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, process.env.CODEIAL_JWT_SECRET, { expiresIn: '10m' });

        const verificationLink = `http://localhost:8000/users/verify-link?token=${token}`;

        userMailer.verifyMailLink(user, verificationLink);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while sending verificaion link' });
    }
}

module.exports.verifyLink = async function (req, res) {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ message: 'Invalid/Expired Token ' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.CODEIAL_JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(410).json({ message: 'Token has expired' });
            } else {
                return res.status(401).json({ message: 'Invalid Token' });
            }
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(401).json({ message: 'User already verified' });
        }

        const updateUser = await User.updateOne({
            _id: user.id
        }, {
            $set: {
                verified: true
            }
        });

        userMailer.mailVerified(user);

        return res.status(200).json({ message: 'User verified successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}




/* One controller for getting the details of the user */

module.exports.details = async function (req, res) {
    try {
        if (!req.user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            verified: user.verified
        };

        return res.status(200).json({
            message: 'User details',
            data: {
                user: userInfo
            }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while fetching details' });
    }
}




/* Two controllers for forgot password: one for sending the otp and the other for verifying the otp */

module.exports.forgotPasswordsendOTP = async function (req, res) {
    try {
        const { email } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            // if the user if verified, send the otp
            const otp = generateOTP();
            const otpExist = await OTP.findOne({ user: user._id });
            if (otpExist) {
                // if otp already exists for the user, update it with the new one
                const updateOTP = await OTP.updateOne({ user: user._id }, { $set: { otp: otp } });
            }else{
                const savedOTP = await OTP.create({
                    user: user._id,
                    otp: otp
                });
            }
            const subject = 'OTP for Password reset';
            userMailer.sendOTP(user, otp, subject);
            return res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            // if the user is not verified, send the email verification link
            const token = jwt.sign({ id: user._id }, process.env.CODEIAL_JWT_SECRET, { expiresIn: '10m' });
            const verificationLink = `http://localhost:8000/users/verify-link?token=${token}`;
            userMailer.verifyMailLink(user, verificationLink);
            return res.status(202).json({ message: 'Verification link sent successfully' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.forgotPasswordverifyOTP = async function (req, res) {
    try {
        const { otp, email } = req.body;
        if (!email || !isValidEmail(email) || !otp || otp.length !== 6) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpDoc = await OTP.findOne({ user: user._id });

        if (!otpDoc) {
            return res.status(410).json({ message: 'OTP expired' });
        }

        if (otp !== otpDoc.otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        } else {
            //deleting the otp
            const deleteOtp = await OTP.deleteOne({ user: user._id });
            return res.status(200).json({ message: 'OTP verified successfully' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.forgotPasswordUpdate = async function (req, res) {
    try {
        const { email, newPassword, confirmNewPassword } = req.body;

        const response = signInSchema.safeParse({email, password: newPassword});

        if (!response.success) {
            const message = response.error.errors[0].message;
            console.log(response.error.errors)
            return res.status(400).json({ message });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // hashing the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findOneAndUpdate({
            _id: user.id
        }, {
            $set: {
                password: hashedPassword
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(500).json({ message: 'Unable to update password' });
        }

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}



/* one controller for for updating user's profile. */

module.exports.updateProfile = async function (req, res) {
    try {
        if (!req.user) {
            return res.status(400).json({ message: 'User not authenticated' });
        }
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { firstName, lastName, email } = req.body;

        if (!firstName || !lastName || !email ) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        if (firstName.length < 2 || firstName.length > 20 || lastName.length < 2 || lastName.length > 20) {
            return res.status(400).json({
                message: "First name and last name must be between 2 and 20 characters"
            });
          }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        let verified = true;

        if(user.email !== email){
            const userWithEmail = await User.findOne({ email });
            if (userWithEmail && user._id.toString() !== userWithEmail._id.toString()) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            verified = false;
        }

        // updating the verified field only if the user updated the email otherwise persisting the original value

        const updatedUser = await User.findByIdAndUpdate({
            _id: user._id
        }, {
            $set: {
                firstName,
                lastName,
                email,
                verified
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(500).json({ message: 'User not found' });
        }

        const userInfo = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            verified: updatedUser.verified
        };

        return res.status(200).json({
            message: 'User profile updated successfully',
            data: {
                user: userInfo
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}




/* one controller for resetting password */
module.exports.resetPassword = async function (req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' })
        }
        const { newPassword, confirmNewPassword, currentPassword } = req.body;
        if (!newPassword || !confirmNewPassword || !currentPassword) {
            return res.status(400).json({ message: 'Necessary fields not provided' })
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Passwords do not match' })
        }

        if (!isValidPassword(newPassword) || !isValidPassword(currentPassword) || !isValidPassword(confirmNewPassword)) {
            return res.status(400).json({ message: 'Invalid password format' })
        }

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Current password' });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate({
            _id: user._id
        }, {
            $set: {
                password: hashedPassword
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(500).json({ message: 'Password could not be updated' });
        }
        
        userMailer.passwordUpdated(updatedUser);
        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

