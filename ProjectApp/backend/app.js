// backend/app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import typeDefs from './schema/typedefs.js';
import placeResolvers from './resolvers/place.resolver.js';
import { userResolvers } from './resolvers/user.resolver.js';
import Place from './models/place.model.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const mergedResolvers = {
  Query: {
    ...placeResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
  Place: {
    ...placeResolvers.Place,
  },
};

const app = express();
const port = process.env.PORT || 4000;

// List of allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',           // Your React frontend origin
  'https://studio.apollographql.com' // Apollo Studio (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} is not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // <-- Very important to allow cookies & auth headers
}));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: mergedResolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) {
        try {
          const token = auth.replace('Bearer ', '');
          const decoded = jwt.verify(token, SECRET);
          return { user: decoded };
        } catch (err) {
          console.warn('⚠️ Invalid token:', err.message);
        }
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app, cors: false }); // Disable Apollo's built-in CORS, handled by express

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
