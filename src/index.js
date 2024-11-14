require('dotenv').config();
const express = require('express');
require('graphql-import-node'); // to load graphql-files
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schemas/schema.graphql');
const resolvers = require('./resolvers/resolvers');
const sequelize = require('./utils/db');
const { authMiddleware } = require('./utils/auth');
const createInitialAdmin = require('./utils/setup');

const startServer = async () => {
  const app = express();
  app.use(authMiddleware); // Apply authentication middleware

  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ user: req.user }) });
  await server.start();
  server.applyMiddleware({ app });

  await sequelize.authenticate();
  const Employee = require('./models/Employee');
  await sequelize.sync();
  await createInitialAdmin();

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
