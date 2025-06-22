const User = require('../services/users');
const jwt = require('jsonwebtoken');
const envPath = require('path').resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const SECRET_KEY = process.env.SECRET_KEY;

exports.isUserTokenValid = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).json({ message: 'mail and password are required' });
  }

  try {
    const user = await User.validateUser(mail, password);
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, mail }, SECRET_KEY, { expiresIn: '2h' });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal error', error: err.message });
  }
};
