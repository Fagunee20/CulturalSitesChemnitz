import { userResolvers } from './user.resolver.js';
import { placeResolvers } from './place.resolver.js';
import { reviewResolvers } from './review.resolver.js';

export default {
  Query: {
    ...userResolvers.Query,
    ...placeResolvers.Query,
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
  Place: {
    ...placeResolvers.Place,
    ...reviewResolvers.Place,
  },
  User: {
    ...userResolvers.User
  }
};
