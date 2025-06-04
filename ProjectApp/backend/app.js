import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded MONGO_URL:', process.env.MONGO_URL);

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import typeDefs from './schema/typedefs.js';
import resolvers from './resolvers/place.resolver.js';
import Place from './models/place.model.js';




const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Ensure indexes are created
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
