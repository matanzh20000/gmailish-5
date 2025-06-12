const TokenModel = require('../models/tokens');
const jwt = require('jsonwebtoken');

// SECRET KEY should be here

exports.isUserTokenValid = (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).json({ message: 'mail and password are required' });
    }

    const userId = TokenModel.isUserTokenValid(mail, password);
    if (!userId) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: userId, mail }, SECRET_KEY, { expiresIn: '2h' });

    return res.status(200).json({ token });
};