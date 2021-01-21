<div align="center">
    <h1>WaterBase</h1>
</div>
<h4>an attempt to create an alternative for <b>CloudFlare realtime database, Cloud FireStore</b></h4>

you can add `Subscription` to Keystone.js CMS GraphQL api.

bonus: an Exmaple for Vue.js Apollo Client is also included in the `/example/vue-client` directory. 

##Usage:

###Step 1:
 
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
###Step 2:

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

addModelToSubscription({keystone, list});
```

###Step 3:

now you can listen for subscriptions in your GraphQL api.

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
