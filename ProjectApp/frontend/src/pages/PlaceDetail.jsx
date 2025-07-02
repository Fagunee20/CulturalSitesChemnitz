// src/pages/PlaceDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import SiteDetail from '../components/SiteDetail';
import PlaceReviews from '../components/PlaceReviews';
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

const MARK_VISITED = gql`
  mutation MarkPlaceAsVisited($placeId: ID!, $mode: String) {
    markPlaceAsVisited(placeId: $placeId, mode: $mode)
  }
`;

const COLLECT_PLACE = gql`
  mutation CollectPlace($placeId: ID!) {
    collectPlace(placeId: $placeId)
  }
`;

const TRADE_PLACE = gql`
  mutation TradePlace($givePlaceId: ID!, $receivePlaceId: ID!, $partnerUserId: ID!) {
    tradePlace(givePlaceId: $givePlaceId, receivePlaceId: $receivePlaceId, partnerUserId: $partnerUserId)
  }
`;

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const { data, loading, error } = useQuery(GET_PLACE_BY_ID, {
    variables: { id },
  });

  const [markVisited] = useMutation(MARK_VISITED);
  const [collectPlace] = useMutation(COLLECT_PLACE);
  const [tradePlace] = useMutation(TRADE_PLACE);

  const handleVisited = async () => {
  const mode = prompt(
    "How did you visit the place? Enter one of: walk, bike, car, manual"
  );

  const allowedModes = ["walk", "bike", "car", "manual"];
  if (!mode || !allowedModes.includes(mode.toLowerCase())) {
    alert("❌ Invalid or no mode selected. Try again with walk, bike, car, or manual.");
    return;
  }

  try {
    await markVisited({
      variables: { placeId: id, mode: mode.toLowerCase() },
    });
    alert(`✅ Place marked as visited via ${mode}`);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to mark as visited");
  }
};


  const handleCollect = async () => {
  try {
    await collectPlace({ variables: { placeId: id } });
    alert("🎯 Place added to your collection!");
  } catch (err) {
    console.error(err);
    alert("❌ Could not collect place");
  }
};

  const handleTrade = async () => {
    const partnerId = prompt("Enter the user ID to trade with:");
    const receiveId = prompt("Enter the ID of the place you want from them:");
    if (!partnerId || !receiveId) return;

    try {
      await tradePlace({
        variables: {
          givePlaceId: id,
          receivePlaceId: receiveId,
          partnerUserId: partnerId,
        },
      });
      alert("🔁 Trade request sent!");
    } catch (err) {
      console.error(err);
      alert("❌ Trade failed");
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
          <div className="button-group mt-4">
            <button onClick={handleVisited} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
              ✅ Mark as Visited
            </button>
            <button onClick={handleCollect} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
              🎯 Collect this Place
            </button>
            <button onClick={handleTrade} className="bg-purple-600 text-white px-4 py-2 rounded">
              🔁 Send Trade Request
            </button>
          </div>
          <PlaceReviews placeId={id} currentUserId={user._id} />
        </>
      )}
    </div>
  );
}
