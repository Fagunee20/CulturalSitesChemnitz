// pages/PlaceDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import SiteDetail from '../components/SiteDetail';

const GET_PLACE_BY_ID = gql`
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

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PLACE_BY_ID, {
    variables: { id },
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const place = data?.getPlaceById;
  if (!place) return <div className="error">Place not found.</div>;

  return (
    <div className="place-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2 className="place-title">{place.name}</h2>
      <SiteDetail place={place} />
    </div>
  );
}
