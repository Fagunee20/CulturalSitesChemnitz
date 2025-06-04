// GraphQL client setup
import { gql } from '@apollo/client';

export const GET_PLACES = gql`
  query GetPlaces {
    getPlaces {
      _id
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
      geometry {
        coordinates
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