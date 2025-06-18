const labels = [];
let idCounter = 0;

const createLabel = (name, icon, user) => {
    const newLabel = { id: ++idCounter, name, icon, user };  // Add user field
    labels.push(newLabel);
    return newLabel;
};

const getAllLabels = (user) => labels.filter(label => label.user === user); // Filter by user

const getLabelByName = (name, user) => {
    return labels.find(label => label.name === name && label.user === user) || null;
};

const getLabelById = (id) => {
    return labels.find(label => label.id === id) || null;
};

const deleteLabel = (id) => {
    const index = labels.findIndex(label => label.id === id);
    if (index === -1) return null;
    labels.splice(index, 1);
};

module.exports = { createLabel, getAllLabels, getLabelByName, getLabelById, deleteLabel };
