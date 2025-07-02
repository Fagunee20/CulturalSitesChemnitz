// backend/resolvers/userResolvers.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Place from '../models/place.model.js';

dotenv.config();
const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const userResolvers = {
  Query: {
    getFavorites: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const populated = await User.findById(user.userId).populate('favorites');
      return populated?.favorites || [];
    },

    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const populated = await User.findById(user.userId).populate({
        path: 'visitedPlaces.place',
        model: 'Place'
      });
      return populated;
    },

    getVisitedPlaces: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const populated = await User.findById(user.userId).populate({
        path: 'visitedPlaces.place',
        model: 'Place'
      });
      return populated?.visitedPlaces || [];
    },

    getCollectedPlaces: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const u = await User.findById(user.userId).populate('collectedPlaces.place');
      return u.collectedPlaces
        .filter(cp => cp.place != null)
        .map(cp => cp.place);
    },
    getUserCollectedPlaces: async (_, { userId }) => {
  const user = await User.findById(userId).populate('collectedPlaces.place');
  if (!user) throw new Error('User not found');
  return user.collectedPlaces.map(cp => cp.place);
},


    getUserByTradeId: async (_, { tradeId }) => {
      return await User.findOne({ tradeId });
    },
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already exists');

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, passwordHash });
      await user.save();

      const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '7d' });
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');

      const valid = await user.validatePassword(password);
      if (!valid) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '7d' });
      return { token, user };
    },

    updateUser: async (_, { name, email, password }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

      return await User.findByIdAndUpdate(user.userId, updateData, { new: true });
    },

    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await User.findByIdAndDelete(user.userId);
      return true;
    },

    addFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await User.findByIdAndUpdate(user.userId, { $addToSet: { favorites: placeId } });
      return true;
    },

    removeFavorite: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await User.findByIdAndUpdate(user.userId, { $pull: { favorites: placeId } });
      return true;
    },

    updateUserLocation: async (_, { lat, lng }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findByIdAndUpdate(
        user.userId,
        { location: { type: 'Point', coordinates: [lng, lat] } },
        { new: true }
      );
    },

    collectNearbyPlaces: async (_, { lat, lng, radius }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const places = await Place.find({
        geometry: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: radius * 1000
          }
        }
      });

      const userDoc = await User.findById(user.userId);
      if (!userDoc.visitedPlaces) userDoc.visitedPlaces = [];
      const visitedSet = new Set(userDoc.visitedPlaces.map(v => v.place.toString()));

      const newVisits = places
        .filter(p => !visitedSet.has(p._id.toString()))
        .map(p => ({
          place: p._id,
          mode: 'walk',
          visitedAt: new Date()
        }));

      userDoc.visitedPlaces.push(...newVisits);
      await userDoc.save();

      return places;
    },

    markPlaceAsVisited: async (_, { placeId, mode }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const place = await Place.findById(placeId);
      if (!place) throw new Error('Place not found');

      const userDoc = await User.findById(user.userId);
      if (!userDoc.visitedPlaces) userDoc.visitedPlaces = [];
      const alreadyVisited = userDoc.visitedPlaces.some(
        (v) => v.place.toString() === placeId
      );

      if (!alreadyVisited) {
        userDoc.visitedPlaces.push({
          place: place._id,
          mode: mode || 'walk',
          visitedAt: new Date(),
        });
        await userDoc.save();
      }

      return true;
    },

    collectPlace: async (_, { placeId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const userDoc = await User.findById(user.userId);
      if (!userDoc.collectedPlaces) userDoc.collectedPlaces = [];

      const placeExists = await Place.findById(placeId);
      if (!placeExists) throw new Error('Invalid place ID');

      const alreadyCollected = userDoc.collectedPlaces.some(
        entry => entry.place?.toString() === placeId
      );

      if (alreadyCollected) return false;

      userDoc.collectedPlaces.push({
        place: new mongoose.Types.ObjectId(placeId),
        mode: 'manual',
        collectedAt: new Date()
      });

      await userDoc.save();
      return true;
    },

    tradePlace: async (_, { givePlaceId, receivePlaceId, partnerUserId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const sender = await User.findById(user.userId);
      const partner = await User.findById(partnerUserId);

      if (!sender || !partner) throw new Error('Users not found');

      const hasPlace = sender.collectedPlaces.some(cp => cp.place.toString() === givePlaceId);
      const partnerHasPlace = partner.collectedPlaces.some(cp => cp.place.toString() === receivePlaceId);

      if (!hasPlace || !partnerHasPlace) {
        throw new Error('One of the users does not own the place they want to trade');
      }

      sender.collectedPlaces = sender.collectedPlaces.filter(cp => cp.place.toString() !== givePlaceId);
      sender.collectedPlaces.push({ place: new mongoose.Types.ObjectId(receivePlaceId), mode: 'traded', collectedAt: new Date() });

      partner.collectedPlaces = partner.collectedPlaces.filter(cp => cp.place.toString() !== receivePlaceId);
      partner.collectedPlaces.push({ place: new mongoose.Types.ObjectId(givePlaceId), mode: 'traded', collectedAt: new Date() });

      await sender.save();
      await partner.save();

      return true;
    },
  },

  User: {
    location: (parent) => {
      if (!parent.location) return null;
      return {
        lat: parent.location.coordinates[1],
        lng: parent.location.coordinates[0],
      };
    },
  },
};