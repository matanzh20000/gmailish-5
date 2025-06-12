const User = require('./users');

/**
 * Checks if the provided username and password match an existing user.
 * @returns user ID if valid, or null if not.
 */
const isUserTokenValid = (username, password) => {
    const user = User.validateUser(username, password); // delegates to usersModel
    return user ? user.id : null;
};

module.exports = {
    isUserTokenValid
};
