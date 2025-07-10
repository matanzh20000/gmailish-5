const User = require('../services/users');

exports.createUser = async (req, res) => {
  const { firstName, lastName, gender, mail, password, backupMail, birthDate } = req.body;
  const imageFile = req.file;
  const imageUrl = imageFile ? `uploads/${imageFile.filename}` : 'uploads/default-avatar.png';

  const isValidEmail = (email) =>
    typeof email === 'string' && /^[a-zA-Z0-9._%+-]+@gmailish\.com$/i.test(email);

  if (!firstName || !lastName || !birthDate.year || !birthDate.month || !birthDate.day || !gender || !mail || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!isValidEmail(mail)) {
    return res.status(400).json({ message: 'Invalid primary email' });
  }

  if (backupMail && !isValidEmail(backupMail)) {
    return res.status(400).json({ message: 'Invalid backup email' });
  }

  const existing = await User.getUserByMail(mail);
  if (existing) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  try {
    const newUser = await User.createUser(firstName, lastName, birthDate, gender, mail, password, backupMail, imageUrl);

    return res.status(201).json({ filename: imageFile?.filename || 'default-avatar.png' });

  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const user = await User.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};
