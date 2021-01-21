<template>
    <div class="apollo-example">
        <div v-for="(book,index) in books" :key="book.id">
            {{ book }}
        </div>
    </div>
</template>

<script>

import gql from "graphql-tag";

export default {
    data() {
        return {
            books: [],
        }
    },

    apollo: {
        books: {
            query: gql`query{books: allBooks{ id name author date }}`,
            subscribeToMore: [{
                document: gql`subscription {
                    book : anyBookChange{
                        id
                        name
                        author
                        date
                    }
                }`,
                variables() {
                    return {
                        //param: this.param,
                    }
                },
                updateQuery: async function (previousResult, {subscriptionData}) {
                    console.log('haha', previousResult, subscriptionData);
                    const {data: {book}} = subscriptionData;
                    let index = this.books.findIndex(it => book.id === it.id);
                    if (index > -1) {
                        let temp = [...this.books];
                        temp[index] = book;
                        this.books = null;
                        await this.$nextTick();
                        this.books = temp;
                        temp = null;
                    } else {
                        this.books.push(book);
                    }
                    // Here, return the new result from the previous with the new data

                },
            }, {
                document: gql`subscription {
                    book : anyBookDelete{
                        id
                        name
                        author
                        date
                    }
                }`,
                variables() {
                    return {
                        //param: this.param,
                    }
                },
                updateQuery: function (previousResult, {subscriptionData}) {
                    console.log('haha', previousResult, subscriptionData);
                    const {data: {book}} = subscriptionData;
                    this.books = this.books.filter(it => it.id !== book.id);
                    // Here, return the new result from the previous with the new data

                },
            },],

        },
    },

    computed: {},
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
    padding: 12px;
}

label {
    display: block;
    margin-bottom: 6px;
}

.input {
    font-family: inherit;
    font-size: inherit;
    border: solid 2px #ccc;
    border-radius: 3px;
}

.error {
    color: red;
}

.images {
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-auto-rows: 300px;
    grid-gap: 10px;
}

.image-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ccc;
    border-radius: 8px;
}

.image {
    max-width: 100%;
    max-height: 100%;
}

.image-input {
    margin: 20px;
}
</style>
