// stockController.js
const db = require('../db');
const axios = require('axios');

exports.buyStock = async (req, res) => {
    const { userID, stockSymbol, quantity } = req.body;

    try {
        const response = await axios.post('https://ea8jqkk2nj.execute-api.us-east-1.amazonaws.com/dev/buystock', {
            userID,
            stockSymbol,
            quantity
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.sellStock = async (req, res) => {
    const { userID, stockSymbol, quantity } = req.body;

    try {
        const response = await axios.post('https://ivjj3hpyfd.execute-api.us-east-1.amazonaws.com/dev/sellstock', {
            userID,
            stockSymbol,
            quantity
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
