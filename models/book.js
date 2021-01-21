const {Text, Checkbox, CalendarDay} = require('@keystonejs/fields');
const {addModelToSubscription} = require("../lib/utils");

module.exports = keystone => {
    const model = {
        fields: {
            name: {
                type: Text,
                isRequired: true,
            },
            author:{
                type:Text,
            },
            date: {
                type: CalendarDay,
            }
        },
    };

    const list = keystone.createList('Book', model);

    addModelToSubscription({keystone, list});
}