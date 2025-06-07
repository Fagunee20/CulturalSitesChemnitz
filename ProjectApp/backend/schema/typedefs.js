// backend/schema/typedefs.js
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
  _id: ID!
  name: String
  email: String
  favorites: [Place]
  location: Location
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
    getPlaceById(id: ID!): Place
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(name: String, email: String, password: String): User
    deleteUser: Boolean
    addFavorite(placeId: ID!): Boolean
    removeFavorite(placeId: ID!): Boolean
    updateUserLocation(lat: Float!, lng: Float!): User
  }
`;

export default typeDefs;
