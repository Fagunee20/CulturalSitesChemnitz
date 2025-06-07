// backend/resolvers/place.resolver.js
import Place from '../models/place.model.js';

const resolvers = {
  Query: {
    getPlaces: async () => {
      try {
        return await Place.find({});
      } catch (error) {
        console.error("Error fetching places:", error);
        throw new Error("Failed to fetch places");
      }
    },

    getPlaceById: async (_, { id }) => {
      return await Place.findById(id);
    },

    getNearbyPlaces: async (_, { lat, lng, radius }) => {
      console.log(`Searching nearby places at lat: ${lat}, lng: ${lng}, radius: ${radius}`);
      const places = await Place.find({
        geometry: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat], // GeoJSON requires [lng, lat]
            },
            $maxDistance: radius,
          },
        },
      });
      console.log(`Found ${places.length} nearby places.`);
      return places;
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
  },
};

export default resolvers;
