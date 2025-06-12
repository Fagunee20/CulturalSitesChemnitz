import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const visitedPlaceSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  mode: {
  type: String,
  enum: ['walk', 'bike', 'car', 'manual'],  // ← Add 'manual' to the list
  default: 'walk'
  },
  visitedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });  // Prevent Mongoose from auto-creating _id for each subdoc

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,

  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],

  visitedPlaces: [visitedPlaceSchema],

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      required: true
    }
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
