import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import TradeForm from '../components/TradeForm';
import { getUser } from '../services/auth';

const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      _id
      name
    }
  }
`;

const GET_COLLECTED_PLACES = gql`
  query {
    getCollectedPlaces {
      _id
      name
    }
  }
`;

const GET_USER_COLLECTED = gql`
  query GetCollected($userId: ID!) {
    getUserCollectedPlaces(userId: $userId) {
      _id
      name
    }
  }
`;

export default function TradePage() {
  const [partnerId, setPartnerId] = useState('');
  const currentUser = getUser();

  const { data: usersData } = useQuery(GET_ALL_USERS);
  const { data: collectedData, loading: loadingCollected } = useQuery(GET_COLLECTED_PLACES);
  const { data: partnerCollectedData } = useQuery(GET_USER_COLLECTED, {
    variables: { userId: partnerId },
    skip: !partnerId,
  });

  const collectedPlaces = collectedData?.getCollectedPlaces || [];
  const partnerPlaces = partnerCollectedData?.getUserCollectedPlaces || [];

  return (
    <div className="trade-page">
      <h2>Trade Cultural Places</h2>

      <h3>Your Collected Places</h3>
      {loadingCollected ? (
        <p>Loading collected places...</p>
      ) : collectedPlaces.length === 0 ? (
        <p>You haven't collected any places yet.</p>
      ) : (
        <ul>
          {collectedPlaces.map((place) => (
            <li key={place._id}>{place.name}</li>
          ))}
        </ul>
      )}

      <label htmlFor="partner-select" className="block font-semibold mb-1">Select a partner to trade with:</label>
      <select
        id="partner-select"
        className="partner-select"
        onChange={(e) => setPartnerId(e.target.value)}
        value={partnerId}
      >
        <option value="">Select...</option>
        {usersData?.getAllUsers.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u._id})
          </option>
        ))}
      </select>

      {partnerId === currentUser?._id && (
        <p className="warning-message">⚠️ You selected your own user ID. Self-trading is not allowed.</p>
      )}

      {partnerId && partnerPlaces.length > 0 && collectedPlaces.length > 0 && partnerId !== currentUser?._id && (
        <TradeForm
          myPlaces={collectedPlaces}
          partnerPlaces={partnerPlaces}
          partnerUserId={partnerId}
        />
      )}
    </div>
  );
}
