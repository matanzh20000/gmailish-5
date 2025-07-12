const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: [String],
  copy: [String],
  blindCopy: [String],
  subject: String,
  body: String,
  label: [String],
  draft: Boolean,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date,
  owner: String,
  userImage: String
});

module.exports = mongoose.model('Mail', mailSchema);

