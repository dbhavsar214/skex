const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define the signup route
router.post('/signup', userController.createUser);

// Define the login route
router.post('/login', userController.loginUser);

router.get('/:userID/getUserStocks', userController.getUserStocks);


module.exports = router;
