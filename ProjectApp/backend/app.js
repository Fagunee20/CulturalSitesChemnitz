import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema/typedefs.js';
import resolvers from './resolvers/index.js'; // ✅ Combined resolvers
import Place from './models/place.model.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const PORT = process.env.PORT || 4000;

const app = express();

// ✅ CORS configuration for frontend & Apollo Studio
const allowedOrigins = [
  'http://localhost:5173',             // Your React frontend
  'https://studio.apollographql.com'   // Apollo Studio (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} is not allowed`), false);
  },
  credentials: true
}));

// ✅ JSON parser
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
  server.applyMiddleware({ app, cors: false }); // Disable Apollo CORS (we use Express CORS)

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    await Place.createIndexes();
    console.log('✅ Place indexes created');

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

startServer();
