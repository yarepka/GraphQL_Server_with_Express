const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// // Hardcoded data
// const customers = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'jdoe@gmail.com',
//     age: 35,
//   },
//   {
//     id: '2',
//     name: 'Steve Smith',
//     email: 'steve@gmail.com',
//     age: 25,
//   },
//   {
//     id: '3',
//     name: 'Sarah Williams',
//     email: 'sarah@gmail.com',
//     age: 32,
//   },
// ];

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // get single customer by id
    /* 
      Query example:
      {
        customer(id: "2") {
          name, age
        }
      }
    */
    customer: {
      type: CustomerType,
      // describing the args
      args: {
        id: { type: GraphQLString },
      },
      // we can get parameters come with request through the args
      resolve(parentValue, args) {
        return axios
          .get('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
      },
    },
    // get all customers
    /* 
      Query example:
      {
        customers {
          name, age
        }
      }
    */
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // resolve response here
        return axios
          .get('http://localhost:3000/customers')
          .then((res) => res.data);
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // add customer
    /* 
      mutation {
        addCustomer(
          name: "Roman Bubnov",
          email: "yarepka01@gmail.com",
          age:22
        ) {
          id, name, age
        }
      } 
    */
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .post('http://localhost:3000/customers', {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },

    // delete customer
    /*
      mutation {
        deleteCustomer(id: "1") {
          id
        }
      }
    */
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .delete('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
      },
    },

    // update customer
    /*
      mutation {
        editCustomer(id: "2", age: 55) {
          id, name, age
        }
      }
    */
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios
          .patch('http://localhost:3000/customers/' + args.id, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
