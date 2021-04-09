const http = require('http');

const express = require('express');
const {keystone, apps} = require('./index.js');
const registerModels = require('./models');
const {initSubscriptionServer} = require("../../export");

registerModels(keystone);

keystone
    .prepare({
        apps: apps,
        dev: process.env.NODE_ENV !== 'production',
    })
    .then(async ({middlewares}) => {
        const cors = require('cors')

        await keystone.connect();
        const app = express();
        app.use(cors())
        app.use(middlewares)

        const expressPlayground = require('graphql-playground-middleware-express').default
        app.get(
            '/',
            expressPlayground({
                endpoint: '/graphql',
                subscriptionEndpoint:'ws://localhost:3000/subscriptions',
            }),
        )

        const httpServer = http.createServer(app);


        httpServer.listen(3000, '0.0.0.0',() => {
            console.log('listening on http://localhost:3000');
            initSubscriptionServer(httpServer,keystone);
        })
    });
