const User = require('../models/users')

exports.createUser = (req, res) => {
    const { name, username, password, email, image } = req.body
    const isValidEmail = email => typeof email === 'string' && /^[^@\s]+@[^@\s]+\.com$/i.test(email);

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    if (User.getUserByUsername(username)) {
        return res.status(400).json({ message: 'Username already exists' })
    }
    if (User.getUserByEmail(email)) {
        return res.status(400).json({ message: 'Email already exists' })
    }
    // Validate email addresses
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Email address is invalid' });
    }
    const newUser = User.createUser(name, username, password, email, image)
    res.status(201).location(`/api/users/${newUser.id}`).end()
}

exports.getUserById = (req, res) => {
    const user = User.getUser(parseInt(req.params.id))
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    return res.json(user)
}



