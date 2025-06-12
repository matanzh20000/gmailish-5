const labels = []
let idCounter = 0

const createLabel = (name, icon) => {
    const newLabel = { id: ++idCounter, name, icon}
    labels.push(newLabel)
    return newLabel
}

const getAllLabels = () => labels

const getLabelByName = (name) => {
    return labels.find(label => label.name === name) || null
}

const getLabelById = (id) => {
    return labels.find(label => label.id === id) || null
}

const deleteLabel = (id) => {
    const index = labels.findIndex(label => label.id === id)
    if (index === -1) return null
    labels.splice(index, 1)
}

module.exports = {createLabel, getAllLabels, getLabelByName, getLabelById, deleteLabel}