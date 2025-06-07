import userResolvers from './user.resolver.js';
import placeResolvers from './place.resolver.js';

export default {
  Query: {
    ...userResolvers.Query,
    ...placeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
  Place: placeResolvers.Place,
};
