// typedefs.js
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Location {
    lat: Float
    lng: Float
  }

  type Address {
    city: String
    street: String
    postcode: String
    housenumber: String
  }

  type Diet {
    halal: String
    kosher: String
    vegan: String
    vegetarian: String
  }

  type Place {
    id: ID!
    name: String
    type: String
    category: String
    operator: String
    website: String
    wheelchair: String
    wikidata: String
    address: Address
    cuisine: String
    opening_hours: String
    diet: Diet
    location: Location
  }

  type User {
    _id: ID
    name: String
    email: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getPlaces: [Place]
    getNearbyPlaces(lat: Float!, lng: Float!, radius: Float!): [Place]
    searchPlaces(keyword: String!): [Place]
    getFavorites: [Place]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addFavorite(placeId: ID!): Boolean
    removeFavorite(placeId: ID!): Boolean
  }
`;

export default typeDefs;
