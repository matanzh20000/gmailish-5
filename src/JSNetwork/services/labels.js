const LabelModel = require('../models/labels');

const createLabel = async (name, icon, user) => {
  const label = new LabelModel({ name, icon, user });
  return await label.save();
};

const getAllLabels = async (user) => {
  return await LabelModel.find({ user }).lean();
};

const getLabelByName = async (name, user) => {
  return await LabelModel.findOne({ name, user }).lean();
};

const getLabelById = async (id) => {
  return await LabelModel.findById(id).lean();
};

const deleteLabel = async (id) => {
  return await LabelModel.findByIdAndDelete(id).lean();
};

const updateLabel = async (id, updates) => {
  return await LabelModel.findByIdAndUpdate(id, updates, { new: true }).lean();
};

module.exports = {
  createLabel,
  getAllLabels,
  getLabelByName,
  getLabelById,
  deleteLabel,
  updateLabel
};