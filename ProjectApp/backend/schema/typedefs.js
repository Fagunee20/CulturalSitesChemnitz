// schema/typedefs.js
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
    averageRating: Float
  }

  type VisitedPlace {
    place: Place!
    mode: String!
    visitedAt: String!
  }

  type CollectedPlace {
    place: Place!
    mode: String!
    collectedAt: String!
  }

  type User {
    _id: ID!
    name: String
    email: String
    tradeId: String
    favorites: [Place]
    visitedPlaces: [VisitedPlace]
    collectedPlaces: [CollectedPlace]
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

  type TradeRequest {
    id: ID!
    fromUser: User!
    toUser: User!
    offeredPlace: Place!
    requestedPlace: Place!
    status: String!
    createdAt: String!
  }

  type Query {
    getPlaces: [Place]
    getNearbyPlaces(lat: Float!, lng: Float!, radius: Float!): [Place]
    searchPlaces(keyword: String!): [Place]
    getFavorites: [Place]
    getPlaceById(id: ID!): Place
    getReviewsByPlace(placeId: ID!): [Review]
    me: User
    getVisitedPlaces: [VisitedPlace]
    getCollectedPlaces: [Place]
    getUserCollectedPlaces(userId: ID!): [Place]

    # ✅ User Queries
    getAllUsers: [User!]!

    # ✅ Trade Queries
    getUserByTradeId(tradeId: String!): User
    myTradeRequests: [TradeRequest!]!
    sentTradeRequests: [TradeRequest!]!
    
  }
  


  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(name: String, email: String, password: String): User
    deleteUser: Boolean

    addFavorite(placeId: ID!): Boolean
    removeFavorite(placeId: ID!): Boolean
    updateUserLocation(lat: Float!, lng: Float!): User

    addReview(placeId: ID!, rating: Int!, comment: String!): Review
    updateReview(reviewId: ID!, rating: Int!, comment: String!): Review
    deleteReview(reviewId: ID!): Boolean

    collectNearbyPlaces(lat: Float!, lng: Float!, radius: Float!): [Place]
    markPlaceAsVisited(placeId: ID!, mode: String): Boolean
    collectPlace(placeId: ID!): Boolean

    tradePlace(givePlaceId: ID!, receivePlaceId: ID!, partnerUserId: ID!): Boolean
    sendTradeRequest(toUserId: ID!, offeredPlaceId: ID!, requestedPlaceId: ID!): TradeRequest!
    respondToTradeRequest(tradeId: ID!, accept: Boolean!): Boolean!
  }
`;

export default typeDefs;
