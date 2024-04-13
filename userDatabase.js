const argon2 = require('argon2-browser');

const userDatabase = {};

// Function to add a user to the database
function addUser(email, hashedPassword, full_name) {
    userDatabase[email] = { email, hashedPassword , full_name};
}

// Function to get the hashed password for a given email
function getUser(email) {
    return userDatabase[email];
}

// Function to verify user credentials
// Update user data in the database
function updateUser(email, hashedPassword) {
    if (userDatabase[email]) {
        userDatabase[email].email = email,
        userDatabase[email].hashedPassword = hashedPassword,
        userDatabase[email].full_name = full_name;
        // userDatabase[email].hashedSalt = hashedSalt;
    } else {
        console.error(`User with email ${email} not found.`);
        return false;
    }
}

module.exports = {
    addUser,
    getUser,
    updateUser
};
