const {PubSub} = require('apollo-server')
const pubsub = new PubSub()
const hash = require('object-hash');

//   pubsub.publish("counter", counter );
module.exports.addModelToSubscription = function ({keystone, list}) {
    let filter_map = {};
    keystone.extendGraphQLSchema({
        subscriptions: [
            {
                schema: `any${list.key}Delete : ${list.key}`,
                subscribe: function (parent, args, context, info) {
                    return pubsub.asyncIterator([`any${list.key}Delete`]);
                },
                resolver: function (item, args, context, info) {
                    return item;
                },
                access: true,
            },  {
                schema: `any${list.key}Change : ${list.key}`,
                subscribe: function (parent, args, context, info) {
                    return pubsub.asyncIterator([`any${list.key}Change`]);
                },
                resolver: function (item, args, context, info) {
                    return item;
                },
                access: true,
            },
            {
                schema: `on${list.key}Change(id:ID!) : ${list.key}`,
                subscribe: function (parent, args, context, info) {
                    const {id} = args;
                    return pubsub.asyncIterator([`on${list.key}Change${id}`]);
                },
                resolver: function (item, args, context, info) {
                    return item;
                },
                access: true,
            },
            {
                schema: `onNew${list.key} : ${list.key}`,
                subscribe: function (parent, args, context, info) {
                    const {id} = args;
                    return pubsub.asyncIterator([`onNew${list.key}`]);
                },
                resolver: function (item, args, context, info) {
                    return item;
                },
                access: true,
            },
            {
                //todo implement similar filter to list filter
                schema: `onSome${list.key}Changed(filter : ${list.key}CreateInput) : ${list.key}`,
                subscribe: function (parent, args, context, info) {
                    const {filter} = args;
                    const filter_hash = hash(filter);
                    filter_map[filter_hash] = filter;
                    return pubsub.asyncIterator([`onSome${list.key}_${filter_hash}`]);
                },
                resolver: function (item, args, context, info) {
                    return item;
                },
                access: true,
            }
        ]
    });
    const hooks = {...list._hooks};

    list._hooks.afterDelete = function ({
                                            operation,
                                            existingItem,
                                            context,
                                            listKey,
                                        }) {
        if (hooks.afterDelete){
            try {
                hooks.afterDelete(...arguments);
            } catch (e) {
                console.error(e);
            }
        }

        pubsub.publish(`any${list.key}Delete`,existingItem);
    }

    list._hooks.afterChange = function ({
                                            operation,
                                            existingItem,
                                            originalInput,
                                            updatedItem,
                                            context,
                                            listKey,
                                        }) {
        if (hooks.afterChange) {
            try {
                hooks.afterChange(...arguments);
            } catch (e) {
                console.error(e);
            }
        }

        pubsub.publish(`any${list.key}Change`, updatedItem);

        const {id} = updatedItem;
        pubsub.publish(`on${list.key}Change${id}`, updatedItem);

        if (!existingItem) {
            pubsub.publish(`onNew${list.key}`, updatedItem);
        }

        for (const hash in filter_map) {
            const filter = filter_map[hash];
            let match = true;
            for (const key in filter) {
                if (existingItem && existingItem[key] !== filter[key]) {
                    match = false
                }
            }
            if (match) pubsub.publish(`onSome${list.key}_${hash}`, updatedItem);
        }
    };

};