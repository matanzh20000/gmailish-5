const users = [];
let idCounter = 0;

const createUser = (firstName, lastName, birthDate, gender, mail, password, backupMail = null) => {
  const newUser = {
    id: ++idCounter,
    firstName,
    lastName,
    birthDate,     // expected to be { year, month, day }
    gender,
    mail,
    password,
    backupMail
  };
  users.push(newUser);
  return newUser;
};

const getUser = (id) => {
  return users.find(user => user.id === id);
};

const validateUser = (mail, password) => {
  return users.find(user => user.mail === mail && user.password === password) || null;
};

const getUserByMail = (mail) => {
  return users.find(user => user.mail === mail) || null;
};

const getUserByBackupMail = (backupMail) => {
  return users.find(user => user.backupMail === backupMail) || null;
};

module.exports = {
  getUser,
  createUser,
  validateUser,
  getUserByMail,
  getUserByBackupMail
};
