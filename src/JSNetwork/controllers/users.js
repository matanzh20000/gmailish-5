const User = require('../models/users');

exports.createUser = (req, res) => {
  const { firstName, lastName, birthDate, gender, mail, password, backupMail } = req.body;

  const isValidEmail = email =>
    typeof email === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(email);

  // Validate required fields
  if (!firstName || !lastName || !birthDate || !gender || !mail || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!birthDate.year || !birthDate.month || !birthDate.day) {
    return res.status(400).json({ message: 'Incomplete birthDate object' });
  }

  if (!isValidEmail(mail)) {
    return res.status(400).json({ message: 'Invalid primary email' });
  }

  if (backupMail && !isValidEmail(backupMail)) {
    return res.status(400).json({ message: 'Invalid backup email' });
  }

  if (User.getUserByMail(mail)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = User.createUser(firstName, lastName, birthDate, gender, mail, password, backupMail);
  return res.status(201).location(`/api/users/${newUser.id}`).end();
};

exports.getUserById = (req, res) => {
  const user = User.getUser(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...safeUser } = user;
  return res.status(200).json(safeUser);
};