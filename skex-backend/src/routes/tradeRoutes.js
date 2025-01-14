const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// Define the signup route
router.post('/buy', tradeController.buyStock);

// Define the login route
router.post('/sell', tradeController.sellStock);

module.exports = router;
