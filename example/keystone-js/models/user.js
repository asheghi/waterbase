const {Text, Password} = require('@keystonejs/fields');
const {PasswordAuthStrategy} = require('@keystonejs/auth-password');


module.exports = keystone => {
    const list = keystone.createList('User', {
        fields: {
            username: {type: Text},
            password: {type: Password},
        },
    });

    const authStrategy = keystone.createAuthStrategy({
        type: PasswordAuthStrategy,
        list: 'User',
        config: {
            identityField: 'username', // default: 'email'
            secretField: 'password', // default: 'password'
        },
    });
}