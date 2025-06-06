// pages/PlaceDetail.jsx
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const place = data?.getPlaceById;
  if (!place) return <p>Place not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Back to Results
      </button>

      <SiteDetail place={place} />
    </div>
  );
}
