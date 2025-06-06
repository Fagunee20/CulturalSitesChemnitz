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

export const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      _id
      name
      category
    }
  }
`;