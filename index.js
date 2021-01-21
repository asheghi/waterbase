const {Keystone} = require('@keystonejs/keystone');
const {GraphQLApp} = require('@keystonejs/app-graphql');
const {MongooseAdapter} = require('@keystonejs/adapter-mongoose');

const keystone = new Keystone({
    adapter: new MongooseAdapter({mongoUri: 'mongodb://localhost/waterbase'}),
});

const gql = require('graphql-tag')

const {AdminUIApp} = require('@keystonejs/app-admin-ui');
module.exports = {
    keystone,
    onConnect: function (keystone) {
        
    },
    apps: [
        new GraphQLApp({
            apiPath: '/graphql',
            graphiqlPath: '/api/graphql',
            apollo: {subscriptionsEndpoint: `ws://localhost:3000/subscriptions?token=asdf`}
        }),
        new AdminUIApp({
            adminPath: '/admin',
            apiPath: '/graphql',
            graphiqlPath: '/api/graphql',

            // authStrategy,
        }),],

};