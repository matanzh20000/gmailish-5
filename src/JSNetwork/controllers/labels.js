const Label = require('../services/labels');

exports.getAllLabels = async (req, res) => {
  const user = req.header('X-user');
  if (!user) return res.status(400).json({ error: 'Missing X-user header' });

  try {
    const labels = await Label.getAllLabels(user);
    return res.status(200).json(labels);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createLabel = async (req, res) => {
  const user = req.header('X-user');
  const { name, icon } = req.body;

  if (!user) return res.status(400).json({ error: 'Missing X-user header' });
  if (!name) return res.status(400).json({ error: 'Label name is required' });

  try {
    const exists = await Label.getLabelByName(name, user);
    if (exists) return res.status(400).json({ error: 'Label with this name already exists for this user' });

    const newLabel = await Label.createLabel(name, icon, user);
    return res.status(201).json(newLabel);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getLabelById = async (req, res) => {
  try {
    const label = await Label.getLabelById(req.params.id);
    if (!label) return res.status(404).json({ error: 'Label not found' });
    return res.status(200).json(label);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateLabel = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Label name is required' });

  try {
    const updated = await Label.updateLabel(req.params.id, { name });
    if (!updated) return res.status(404).json({ error: 'Label not found' });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteLabel = async (req, res) => {
  try {
    const deleted = await Label.deleteLabel(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Label not found' });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
