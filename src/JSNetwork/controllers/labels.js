const Label = require('../models/labels');

exports.getAllLabels = (req, res) => {
    const user = req.header('X-user');
    if (!user) return res.status(400).json({ error: 'Missing X-user header' });
    return res.status(200).json(Label.getAllLabels(user));
};

exports.createLabel = (req, res) => {
    const user = req.header('X-user');
    const { name, icon } = req.body;

    if (!user) return res.status(400).json({ error: 'Missing X-user header' });
    if (!name) return res.status(400).json({ error: 'Label name is required' });
    if (Label.getLabelByName(name, user)) {
        return res.status(400).json({ error: 'Label with this name already exists for this user' });
    }

    const newLabel = Label.createLabel(name, icon, user);
    return res.status(201).json(newLabel);
};


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