const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: {
    year: Number,
    month: Number,
    day: Number
  },
  gender: String,
  mail: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  backupMail: String,
  image: String
});

module.exports = mongoose.model('User', userSchema);
