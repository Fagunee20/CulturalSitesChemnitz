import Place from '../models/place.model.js';

export const placeResolvers = {
  Query: {
    getPlaces: async () => {
      return await Place.find({});
    },

    getPlaceById: async (_, { id }) => {
      return await Place.findById(id);
    },

    getNearbyPlaces: async (_, { lat, lng, radius }) => {
      return await Place.find({
        geometry: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: radius,
          },
        },
      });
    },

    searchPlaces: async (_, { keyword }) => {
      return await Place.find({
        $text: { $search: keyword },
      });
    },
  },

  Place: {
    id: (parent) => parent._id.toString(),
    location: (parent) => {
      if (!parent.geometry) return null;
      return {
        lat: parent.geometry.coordinates[1],
        lng: parent.geometry.coordinates[0],
      };
    },
  }
};
