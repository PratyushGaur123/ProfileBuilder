const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));

// router.get('/home' );

module.exports = router;