// resolvers/tradeResolvers.js
import TradeRequest from '../models/TradeRequest.js';
import User from '../models/user.model.js';

export const tradeResolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        return await User.find({}, '_id name');
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },

    getUserByTradeId: async (_, { tradeId }) => {
      return await User.findOne({ tradeId });
    },

    myTradeRequests: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await TradeRequest.find({ toUser: user.userId })
        .populate('fromUser')
        .populate('offeredPlace')
        .populate('requestedPlace');
    },

    sentTradeRequests: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await TradeRequest.find({ fromUser: user.userId })
        .populate('toUser')
        .populate('offeredPlace')
        .populate('requestedPlace');
    }
  },

  Mutation: {
    sendTradeRequest: async (_, { toUserId, offeredPlaceId, requestedPlaceId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      if (toUserId === user.userId) throw new Error("Can't trade with yourself");

      const request = new TradeRequest({
        fromUser: user.userId,
        toUser: toUserId,
        offeredPlace: offeredPlaceId,
        requestedPlace: requestedPlaceId
      });
      await request.save();
      return request.populate(['fromUser', 'toUser', 'offeredPlace', 'requestedPlace']);
    },

    respondToTradeRequest: async (_, { tradeId, accept }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const trade = await TradeRequest.findById(tradeId);
      if (!trade || trade.toUser.toString() !== user.userId) throw new Error('Trade not found or unauthorized');

      trade.status = accept ? 'accepted' : 'rejected';
      await trade.save();

      if (accept) {
        const fromUser = await User.findById(trade.fromUser);
        const toUser = await User.findById(trade.toUser);

        // Remove traded places from each user's collectedPlaces
        fromUser.collectedPlaces = fromUser.collectedPlaces.filter(cp => cp.place.toString() !== trade.offeredPlace.toString());
        toUser.collectedPlaces = toUser.collectedPlaces.filter(cp => cp.place.toString() !== trade.requestedPlace.toString());

        // Add the new traded places
        fromUser.collectedPlaces.push({ place: trade.requestedPlace, mode: 'trade', collectedAt: new Date() });
        toUser.collectedPlaces.push({ place: trade.offeredPlace, mode: 'trade', collectedAt: new Date() });

        await fromUser.save();
        await toUser.save();
      }

      return true;
    },

    tradePlace: async (_, { givePlaceId, receivePlaceId, partnerUserId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      if (partnerUserId === user.userId) throw new Error('Cannot trade with yourself');

      const currentUser = await User.findById(user.userId);
      const partnerUser = await User.findById(partnerUserId);

      currentUser.collectedPlaces = currentUser.collectedPlaces.filter(cp => cp.place.toString() !== givePlaceId);
      partnerUser.collectedPlaces = partnerUser.collectedPlaces.filter(cp => cp.place.toString() !== receivePlaceId);

      currentUser.collectedPlaces.push({ place: receivePlaceId, mode: 'trade', collectedAt: new Date() });
      partnerUser.collectedPlaces.push({ place: givePlaceId, mode: 'trade', collectedAt: new Date() });

      await currentUser.save();
      await partnerUser.save();

      return true;
    }
  }
};
