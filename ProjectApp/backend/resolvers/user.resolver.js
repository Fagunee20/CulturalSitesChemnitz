import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Place from '../models/place.model.js';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'dev-secret-key'; // fallback for dev

export const userResolvers = {
  Mutation: {
    register: async (_, { name, email, password }) => {
  try {
    console.log("➡️ Register input:", name, email);

    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '7d' });

    console.log("✅ Returning:", { token, user });
    return { token, user };

  } catch (error) {
    console.error('❌ Register error:', error.message);
    throw new Error(error.message || 'Registration failed');
  }
}
,

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid credentials');

        const valid = await user.validatePassword(password);
        if (!valid) throw new Error('Invalid credentials');

        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '7d' });

        return { token, user };
      } catch (error) {
        console.error('❌ Login error:', error.message);
        throw new Error(error.message || 'Login failed');
      }
    },

    addFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const place = await Place.findById(placeId);
      if (!place) throw new Error('Place not found');

      await User.findByIdAndUpdate(user._id, {
        $addToSet: { favorites: placeId }
      });

      return true;
    },

    removeFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      await User.findByIdAndUpdate(user._id, {
        $pull: { favorites: placeId }
      });

      return true;
    }
  },

  Query: {
    getFavorites: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const populated = await User.findById(user._id).populate('favorites');
      return populated?.favorites || [];
    }
  }
};
