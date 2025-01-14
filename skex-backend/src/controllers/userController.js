const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');

// // Create a new user
// exports.createUser = async (req, res) => {
//     const { email, sin_number, password } = req.body;

//     if (!sin_number || !email || !password) {
//         return res.status(400).send('SIN Number, email, and password are required');
//     }

//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const [result] = await db.query('INSERT INTO Users (email, sin_number, password) VALUES (?, ?, ?)', [email, sin_number, hashedPassword]);
//         res.status(201).json({ id: result.insertId, email });
//     } catch (error) {
//         console.error('Error creating user:', error); // Log the error
//         res.status(500).send('Error creating user');
//     }
// };

// exports.loginUser = async (req, res) => {
    

//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send('Email and password are required');
//     }

//     try {
//         // Check if the user exists
//         const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

//         if (users.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const user = users[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ userId: user.userid, email: user.email }, secretKey, { expiresIn: '1h' });

//         res.status(200).json({ message: 'Login successful', token, userID: user.userid });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).send('Error during login');
//     }
// };

exports.getUserStocks = async (req, res) => {
    const userID = parseInt(req.params.userID);

    if (isNaN(userID)) {
        return res.status(400).json({ error: 'Invalid userID' });
    }

    try {
        // Query to get stock symbols and quantities for the user
        const query = `
            SELECT s.stockSymbol,s.stockName, us.quantity
            FROM UserStocks us
            JOIN Stocks s ON us.stockID = s.stockID
            WHERE us.userid = ?
        `;

        const [results] = await db.query(query, [userID]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No stocks found for this userID' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching user stocks:', error);
        res.status(500).send('Error fetching user stocks');
    }
};