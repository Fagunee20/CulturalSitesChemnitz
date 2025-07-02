import { userResolvers } from './user.resolver.js';
import { placeResolvers } from './place.resolver.js';
import { reviewResolvers } from './review.resolver.js';
import { tradeResolvers } from './tradeResolvers.js';

export default {
  Query: {
    ...userResolvers.Query,
    ...placeResolvers.Query,
    ...reviewResolvers.Query,
    ...tradeResolvers.Query,         // ✅ Trade Queries (myTradeRequests, sentTradeRequests)
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...tradeResolvers.Mutation,     // ✅ Trade Mutations (send/respond)
  },
  Place: {
    ...placeResolvers.Place,
    ...reviewResolvers.Place,
  },
  User: {
    ...userResolvers.User,
  },
  TradeRequest: {
    // Optional: Add custom resolvers for nested fields if needed
  }
};
