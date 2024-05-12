const express = require('express');
const userContoller = require('../controllers/userController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();


router.post('/details', authMiddleware.userAuth, userContoller.details);

router.put('/update-profile', authMiddleware.userAuth, userContoller.updateProfile);

router.put('/reset-password', authMiddleware.userAuth, userContoller.resetPassword);

module.exports = router;

