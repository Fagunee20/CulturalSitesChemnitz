import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import SiteDetail from '../components/SiteDetail';
import PlaceReviews from '../components/PlaceReviews';
import { MARK_PLACE_AS_VISITED } from '../services/graphql';
import { getUser } from '../services/auth';

const GET_PLACE_BY_ID = gql`
  query GetPlaceById($id: ID!) {
    getPlaceById(id: $id) {
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

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const { data, loading, error } = useQuery(GET_PLACE_BY_ID, {
    variables: { id },
  });

  const [markVisited] = useMutation(MARK_PLACE_AS_VISITED);

  const handleVisited = async () => {
    try {
      await markVisited({ variables: { placeId: id, mode: "manual" } });
      alert("Place marked as visited!");
    } catch (err) {
      console.error(err);
      alert("Error marking as visited");
    }
  };

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

      {user && (
        <>
          <button
            onClick={handleVisited}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Mark as Visited
          </button>
          <PlaceReviews placeId={id} currentUserId={user._id} />
        </>
      )}
    </div>
  );
}
