// backend/resolvers/user.resolver.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Place from '../models/place.model.js';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

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
    },

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

    updateUser: async (_, { name, email, password }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, { new: true });
      return updatedUser;
    },

    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');

      await User.findByIdAndDelete(user.userId);
      return true;
    },

    addFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const place = await Place.findById(placeId);
      if (!place) throw new Error('Place not found');

      await User.findByIdAndUpdate(user.userId, {
        $addToSet: { favorites: placeId }
      });

      return true;
    },

    removeFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      await User.findByIdAndUpdate(user.userId, {
        $pull: { favorites: placeId }
      });

      return true;
    },

    // ✅ Correctly placed here
    updateUserLocation: async (_, { lat, lng }, { user }) => {
  if (!user) throw new Error('Not authenticated');

  console.log("Updating location for user:", user.userId, "lat:", lat, "lng:", lng);

  const updated = await User.findByIdAndUpdate(
    user.userId,
    {
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    },
    { new: true }
  );

  console.log("Updated user:", updated);
  return updated;
},
  },

  Query: {
    getFavorites: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const populated = await User.findById(user.userId).populate('favorites');
      return populated?.favorites || [];
    }
  }
};
