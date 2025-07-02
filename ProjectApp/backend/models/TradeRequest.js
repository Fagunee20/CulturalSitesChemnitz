// models/TradeRequest.js
import mongoose from 'mongoose';

const tradeRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  requestedPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const TradeRequest = mongoose.model('TradeRequest', tradeRequestSchema);
export default TradeRequest;
