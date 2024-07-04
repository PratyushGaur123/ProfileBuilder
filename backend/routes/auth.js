const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/sign-up', userController.signUp);

router.post('/sign-in-password', userController.signInPassword);

router.post('/sign-in-otp', userController.signInSendOTP);

router.post('/sign-in-otp-verify', userController.signInVerifyOTP);

router.get('/send-link', authMiddleware.userAuth, userController.sendLink);

router.get('/verify-link', userController.verifyLink);

router.post('/forgot-password-otp', userController.forgotPasswordsendOTP);

router.post('/forgot-password-otp-verify', userController.forgotPasswordverifyOTP);

router.put('/update-forgot-password',  userController.forgotPasswordUpdate);



module.exports = router;

// 