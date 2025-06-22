const User = require('../models/users');

const createUser = async (firstName, lastName, birthDate, gender, mail, password, backupMail = null, image = null) => {
  const user = new User({ firstName, lastName, birthDate, gender, mail, password, backupMail, image });
  return await user.save();
};

const getUser = async (id) => {
  return await User.findById(id).lean();
};

const validateUser = async (mail, password) => {
  return await User.findOne({ mail, password }).lean();
};

const getUserByMail = async (mail) => {
  return await User.findOne({ mail }).lean();
};

const getUserByBackupMail = async (backupMail) => {
  return await User.findOne({ backupMail }).lean();
};

module.exports = {
  createUser,
  getUser,
  validateUser,
  getUserByMail,
  getUserByBackupMail
};