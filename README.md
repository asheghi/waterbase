<div align="center">
    <h1>WaterBase</h1>
</div>
<h5>an attempt to create an alternative for <b>CloudFlare realtime database, Cloud FireStore</b></h5>

<h4>add `Subscription` to Keystone.js CMS GraphQL api</h4>

<i>an Exmaple for Vue.js Apollo Client is also included in the `/example/vue-client` directory.</i> 

<h2>Usage:</h2>

<h3>Step 1:</h3>
 
you need to go with the custom http server mode with keystone.js.
then call `initSubscriptionServer` with your http server and keystone object.

Example:
```js
keystone
    .prepare({
        apps: apps,
        dev: process.env.NODE_ENV !== 'production',
    })
    .then(async ({middlewares}) => {
        await keystone.connect();
        const app = express();
        app.use(middlewares)
        const httpServer = http.createServer(app);
        
        httpServer.listen(3000, () => {
                //first step
                initSubscriptionServer(httpServer,keystone);
        })
});
```
<h3>Step 2:</h3>

to add Model Subscription you need to call `addModelToSubscription` method with your list.

Example:
```js
const model = {
    fields: {
        name: {
            type: Text,
            isRequired: true,
        },
        //...
    },
};

const list = keystone.createList('Book', model);
//second step
addModelToSubscription({keystone, list});
```

<h3>Step 3:</h3>

now you can listen to subscriptions in your GraphQL api.

<div align="center"><img src="https://i.ibb.co/bsnFDLq/Screenshot-from-2021-01-21-14-08-34.png" alt="Screenshot-from-2021-01-21-14-08-34" border="0"></div>


Example:
```
subscription {
    book : anyBookChange{
        id
        name
        author
        date
    }
}
```
