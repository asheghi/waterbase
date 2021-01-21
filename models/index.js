const registerBook = require('./book');
const registerUser = require('./user');

module.exports = keystone => {
    registerBook(keystone);
    registerUser(keystone);
}