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
     _id: ID!
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
    averageRating: Float  # ✅ New field
  }

  type VisitedPlace {
    place: Place!
    mode: String!
    visitedAt: String!
  }

  type User {
    _id: ID!
    name: String
    email: String
    favorites: [Place]
    visitedPlaces: [VisitedPlace]  # ✅ New field
    location: Location
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Review {
    _id: ID!
    place: Place!
    user: User!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type Query {
    getPlaces: [Place]
    getNearbyPlaces(lat: Float!, lng: Float!, radius: Float!): [Place]
    searchPlaces(keyword: String!): [Place]
    getFavorites: [Place]
    getPlaceById(id: ID!): Place
    getReviewsByPlace(placeId: ID!): [Review]       # ✅ New
    me: User    
    getVisitedPlaces: [VisitedPlace]                                     # ✅ New
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(name: String, email: String, password: String): User
    deleteUser: Boolean
    addFavorite(placeId: ID!): Boolean
    removeFavorite(placeId: ID!): Boolean
    updateUserLocation(lat: Float!, lng: Float!): User

    # ✅ New review system
    addReview(placeId: ID!, rating: Int!, comment: String!): Review
    updateReview(reviewId: ID!, rating: Int!, comment: String!): Review
    deleteReview(reviewId: ID!): Boolean

    # ✅ Visited place tracker
    collectNearbyPlaces(lat: Float!, lng: Float!, radius: Float!): [Place]
    markPlaceAsVisited(placeId: ID!, mode: String): Boolean
    
  }
`;

export default typeDefs;
