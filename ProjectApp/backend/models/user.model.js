import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0], // Default to [longitude, latitude] = [0, 0]
      required: true
    }
  }
}, { timestamps: true });

// ✅ Create 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
