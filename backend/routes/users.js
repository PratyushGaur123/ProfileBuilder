const express = require('express');
const userContoller = require('../controllers/userController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/sign-up', userContoller.signUp);


router.post('/sign-in-password', userContoller.signInPassword);

router.post('/sign-in-otp', userContoller.signInSendOTP);

router.post('/sign-in-otp-verify', userContoller.signInVerifyOTP);


router.get('/send-link', authMiddleware.userAuth, userContoller.sendLink);

router.get('/verify-link', userContoller.verifyLink);


router.post('/details', authMiddleware.userAuth, userContoller.details);


router.post('/forgot-password-otp', userContoller.forgotPasswordsendOTP);

router.post('/forgot-password-otp-verify', userContoller.forgotPasswordverifyOTP);

router.put('/update-forgot-password',  userContoller.forgotPasswordUpdate);


router.put('/update-profile', authMiddleware.userAuth, userContoller.updateProfile);



router.put('/reset-password', authMiddleware.userAuth, userContoller.resetPassword);


module.exports = router;

