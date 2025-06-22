const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  user: { type: String, required: true }
});

labelSchema.index({ name: 1, user: 1 }, { unique: true }); 

module.exports = mongoose.model('Label', labelSchema);
