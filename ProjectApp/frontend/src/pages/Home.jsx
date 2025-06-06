// src/pages/Home.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_PLACES, GET_FAVORITES } from '../services/graphql';
import MapView from '../components/MapView';
import ListView from '../components/ListView';
import Header from '../components/Header'; // ✅ optional

const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_PLACES);
  const [filter, setFilter] = useState('');
  const [addFavorite] = useMutation(ADD_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: true,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredPlaces = data.getPlaces.filter(place =>
    place.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddFavorite = async (placeId) => {
    try {
      await addFavorite({ variables: { placeId } });
      alert('✅ Added to favorites!');
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  return (
    <div>
      <Header /> {/* Optional: Include your header here */}
      <input
        type="text"
        placeholder="Search by name..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <MapView places={filteredPlaces} />
      <ListView
        places={filteredPlaces}
        onAddFavorite={handleAddFavorite}
      />
    </div>
  );
}
