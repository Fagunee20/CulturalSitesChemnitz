// backend/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const visitedPlaceSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  },
  mode: {
    type: String,
    enum: ['walk', 'bike', 'car', 'manual'],
    default: 'walk',
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const collectedPlaceSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  mode: {
    type: String,
    enum: ['manual', 'traded','trade'],
    default: 'manual',
  },
  collectedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,

  tradeId: { type: String, unique: true, default: uuidv4 },

  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  }],

  visitedPlaces: [visitedPlaceSchema],
  collectedPlaces: [collectedPlaceSchema],

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      required: true,
    },
  },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
