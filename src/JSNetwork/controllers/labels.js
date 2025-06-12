const Label = require('../models/labels');

exports.getAllLabels = (req, res) => {
    return res.status(200).json(Label.getAllLabels());
}

exports.createLabel = (req, res) => {
    const { name, icon } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
    }
    if (Label.getLabelByName(name)) {
        return res.status(400).json({ error: 'Label with this name already exists' });
    }
    const newLabel = Label.createLabel(name, icon);
    return res.status(201).json(newLabel);
}

exports.getLabelById = (req, res) => {
    const label = Label.getLabelById(parseInt(req.params.id));
    if (!label) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json(label);
}

exports.updateLabel = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
    }
    const label = Label.getLabelById(parseInt(req.params.id));
    if (!label) {
        return res.status(404).json({ error: 'Label not found' });
    }
    label.name = name;
    return res.status(204).end();
}

exports.deleteLabel = (req, res) => {
    const label = Label.getLabelById(parseInt(req.params.id));
    if (!label) {
        return res.status(404).json({ error: 'Label not found' });
    }
    Label.deleteLabel(label.id);
    return res.status(204).end()
}