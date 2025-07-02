// src/pages/Home.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_PLACES, GET_FAVORITES } from '../services/graphql';
import MapView from '../components/MapView';
import ListView from '../components/ListView';
import { getUser } from '../services/auth';

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

  const user = getUser();

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Error: {error.message}</p>;

  const filteredPlaces = data.getPlaces.filter(place =>
    place.name.toLowerCase().includes(filter.toLowerCase()) ||
    place.type?.toLowerCase().includes(filter.toLowerCase()) ||
    place.category?.toLowerCase().includes(filter.toLowerCase())
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
    <div className="home-wrapper px-4">
      <input
        type="text"
        placeholder="Search by name, type, or category..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="home-search w-full p-2 border rounded-md my-4"
      />

      {/* ✅ Simple text legend */}
      <p className="text-sm text-center my-2">
        Blue: Restaurants | Green: Museums | Yellow: Theatres | Gray: Your Location
      </p>

      <MapView places={filteredPlaces} />

      <ListView
        places={filteredPlaces}
        onAddFavorite={handleAddFavorite}
      />

      {user && (
        <Link to="/ten-minute">
          <button
            className="floating-tenmin-button fixed bottom-6 right-6 bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700"
            title="See cultural sites near you"
          >
            🕒 10-Minute View
          </button>
        </Link>
      )}
    </div>
  );
}
