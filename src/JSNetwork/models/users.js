/***
 * Every user will have the next fields upon registration:
 * - id: a number staring from 1 
 * - name: a string
 * - username: a string with the username for signing in
 * - password: a string with the password of the user 
 * - email: a string with the email of the user
 * - image: a file with the image of the user
 * 
 * When getting a user by ID, the user will have the next fields:
 * - id: a number staring from 1
 * - name: a string
 * - email: a string with the email of the user
 * - image: a file with the image of the user
 */


const users = []
let idCounter = 0

const createUser = (name, username, password, email, image) => {
    const newUser = { id: ++idCounter, name, username, password, email, image }
    users.push(newUser)
    return newUser
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const validateUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password) || null;
};

const getUserByUsername = (username) => {
    return users.find(user => user.username === username) || null;
}

const getUserByEmail = (email) => {
    return users.find(user => user.email === email) || null;
}
module.exports = {getUser, createUser, validateUser, getUserByUsername, getUserByEmail }