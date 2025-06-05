import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded MONGO_URL:', process.env.MONGO_URL);

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { mergeResolvers } from '@graphql-tools/merge';

import typeDefs from './schema/typedefs.js';
import placeResolvers from './resolvers/place.resolver.js'; // ✅ rename from 'resolvers'
import { userResolvers } from './resolvers/user.resolver.js';
import Place from './models/place.model.js';

// ✅ merge resolvers properly
const mergedResolvers = mergeResolvers([placeResolvers, userResolvers]);

const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: mergedResolvers, // ✅ use merged resolvers here
    context: ({ req }) => {
      // Add auth context if needed later
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    await Place.createIndexes();
    console.log('✅ Place indexes created');

    app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

startServer();
