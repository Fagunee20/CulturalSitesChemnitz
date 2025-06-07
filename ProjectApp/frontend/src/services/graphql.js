// GraphQL client setup
import { gql } from '@apollo/client';

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
export const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;


export const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      id
      name
      category
      address {
        city
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
        type
        coordinates
      }
    }
  }
`;


