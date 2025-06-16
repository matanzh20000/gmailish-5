const TokenModel = require('../models/tokens');
const jwt = require('jsonwebtoken');
const envPath = require('path').resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const SECRET_KEY = process.env.SECRET_KEY;

exports.isUserTokenValid = (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).json({ message: 'mail and password are required' });
    }

    const userId = TokenModel.isUserTokenValid(mail, password);
    if (!userId) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    if (!process.env.SECRET_KEY) {
        console.error('[ERROR] SECRET_KEY is undefined. Check .env loading.');
        return res.status(500).json({ message: 'Internal server error: missing secret' });
    }


    const token = jwt.sign({ id: userId, mail }, SECRET_KEY, { expiresIn: '2h' });

    return res.status(200).json({ token });
};
