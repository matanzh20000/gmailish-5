const TokenModel = require('../models/tokens');

exports.isUserTokenValid = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const userId = TokenModel.isUserTokenValid(username, password);
    if (!userId) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ id: userId });
};
