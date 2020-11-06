const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');

const app = express();

// entry point to interact with GraphQL
app.use(
  '/graphql',
  expressGraphQL({
    schema: schema,
    graphiql: true, // alow us to use GraphiQL for testing
  })
);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
