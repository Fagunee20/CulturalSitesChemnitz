import { gql } from '@apollo/client';

// ---------- QUERIES ----------

export const GET_PLACES = gql`
  query GetPlaces {
    getPlaces {
      id
      name
      type
      category
      operator
      website
      wheelchair
      address {
        city
        street
        postcode
        housenumber
      }
      location {
        lat
        lng
      }
    }
  }
`;

export const GET_NEARBY_PLACES = gql`
  query GetNearbyPlaces($lat: Float!, $lng: Float!, $radius: Float!) {
    getNearbyPlaces(lat: $lat, lng: $lng, radius: $radius) {
      id
      name
      category
      location {
        lat
        lng
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      id
      name
      type
      category
      address {
        city
      }
    }
  }
`;

export const GET_ME = gql`
  query {
    me {
      _id
      name
      email
      favorites {
        id
        name
      }
      visitedPlaces {
        place {
          id
          name
          category
        }
        visitedAt
        mode
      }
    }
  }
`;

export const GET_USER_REVIEWS = gql`
  query {
    getUserReviews {
      _id
      rating
      comment
      createdAt
      place {
        name
      }
    }
  }
`;

export const GET_REVIEWS_BY_PLACE = gql`
  query GetReviewsByPlace($placeId: ID!) {
    getReviewsByPlace(placeId: $placeId) {
      _id
      rating
      comment
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

export const IS_PLACE_VISITED = gql`
  query IsPlaceVisited($placeId: ID!) {
    isPlaceVisited(placeId: $placeId)
  }
`;

export const GET_PLACE_BY_ID = gql`
  query GetPlaceById($id: ID!) {
    getPlaceById(id: $id) {
      id
      name
      category
      operator
      website
      wheelchair
      address {
        city
        street
        postcode
        housenumber
      }
      location {
        lat
        lng
      }
    }
  }
`;
export const GET_VISITED_PLACES = gql`
  query {
    getVisitedPlaces {
      place {
        id
        name
        category
        address {
          city
        }
      }
      mode
      visitedAt
    }
  }
`;


// ---------- MUTATIONS ----------

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($name: String!, $email: String!) {
    updateUser(name: $name, email: $email) {
      _id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation {
    deleteUser
  }
`;

export const UPDATE_USER_LOCATION = gql`
  mutation UpdateUserLocation($lat: Float!, $lng: Float!) {
    updateUserLocation(lat: $lat, lng: $lng) {
      _id
      name
      location {
        lat
        lng
      }
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($placeId: ID!) {
    removeFavorite(placeId: $placeId)
  }
`;

export const MARK_PLACE_AS_VISITED = gql`
  mutation MarkPlaceAsVisited($placeId: ID!, $mode: String) {
    markPlaceAsVisited(placeId: $placeId, mode: $mode)
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($placeId: ID!, $rating: Int!, $comment: String!) {
    addReview(placeId: $placeId, rating: $rating, comment: $comment) {
      _id
      rating
      comment
      createdAt
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Int!, $comment: String!) {
    updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      _id
      rating
      comment
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;
