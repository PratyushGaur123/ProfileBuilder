const nodemailer = require('../config/nodemailer');

const errorHandler = (err, info)=>{
    if(err){
        console.log('Error in sending mail: ');
        return;
    }
    console.log('Mail sent successfully');
}

module.exports.sendOTP = (user, otp, subject) => {
    if(!user || !otp || !user.email || !subject){
        return;
    }
    const htmlString = nodemailer.renderTemplate({ user, otp, subject }, '/users/otpVerify.ejs');
    const customText = `OTP for verification of mail is: ${otp}`;
    nodemailer.transporter.sendMail({
        from: {
            name: 'Profile Builder',
            address: 'noreply@profilebuilder.com'
        },
        to: user.email,
        subject: subject,
        html: htmlString,
        text: customText
    }, errorHandler);
}

module.exports.verifyMailLink = (user, link) => {
    if(!user || !link || !user.email){
        console.log('User/Link not provided');
        return;
    }
    const htmlString = nodemailer.renderTemplate({ user, link }, '/users/linkVerify.ejs');
    const customText = `Link for verification of mail is: ${link}`;

    nodemailer.transporter.sendMail({
        from: {
            name: 'Profile Builder',
            address: 'noreply@profilebuilder.com'
        },
        to: user.email,
        subject: 'Link for Email Verification',
        html: htmlString,
        text: customText
    }, errorHandler)
}


module.exports.mailVerified = (user)=>{
    if(!user ||!user.email){
        console.log('User not provided');
        return;
    }
    const htmlString = nodemailer.renderTemplate({ user }, '/users/emailVerified.ejs');
    const customText = `Your mail has been verified`;

    nodemailer.transporter.sendMail({
        from: {
            name: 'Profile Builder',
            address: 'noreply@profilebuilder.com'
        },
        to: user.email,
        subject: 'Email Verified',
        html: htmlString,
        text: customText
    }, errorHandler)
}

module.exports.welcomeMail = (user)=>{
    if(!user ||!user.email){
        return;
    }

    const htmlString = nodemailer.renderTemplate({ user }, '/users/welcome.ejs');
    const customText = `Welcome to Profile Builder`;

    nodemailer.transporter.sendMail({
        from: {
            name: 'Profile Builder',
            address: 'noreply@profilebuilder.com'
        },
        to: user.email,
        subject: 'Welcome to Profile Builder',
        html: htmlString,
        text: customText
    }, errorHandler)
}

module.exports.passwordUpdated = (user)=>{
    if(!user ||!user.email){
        return;
    }
    const htmlString = nodemailer.renderTemplate({ user }, '/users/passwordUpdated.ejs');
    const customText = `Dear ${user.firstName}, your password for Profile Builder account has been updated`;

    nodemailer.transporter.sendMail({
        from: {
            name: 'Profile Builder',
            address: 'noreply@profilebuilder.com'
        },
        to: user.email,
        subject: 'Password Updated',
        html: htmlString,
        text: customText
    }, errorHandler)
}

module.exports.errorHandler = errorHandler;