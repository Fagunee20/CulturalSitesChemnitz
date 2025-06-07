import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_PLACES, GET_FAVORITES } from '../services/graphql';
import MapView from '../components/MapView';
import ListView from '../components/ListView';
import Header from '../components/Header';
import { getUser } from '../services/auth'; // ✅ Auth helper

// ✅ Mutation to add favorite place
const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;

export default function Home() {
  // GraphQL query for places
  const { loading, error, data } = useQuery(GET_PLACES);
  const [filter, setFilter] = useState('');

  // GraphQL mutation for adding favorites
  const [addFavorite] = useMutation(ADD_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: true,
  });

  const user = getUser(); // ✅ Get logged-in user info

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Error: {error.message}</p>;

  // Filtered result from search input
  const filteredPlaces = data.getPlaces.filter(place =>
    place.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Add to favorites handler
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
      {/* Header component */}
      <Header />

      {/* Main content */}
      <main className="p-4 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search by name..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border p-2 rounded w-full mb-4 shadow-sm"
        />

        {/* Map View */}
        <MapView places={filteredPlaces} />

        {/* List View with add to favorite support */}
        <ListView
          places={filteredPlaces}
          onAddFavorite={handleAddFavorite}
        />
      </main>

      {/* 🕒 Floating Button for 10-Minute View (Only if logged in) */}
      {user && (
        <Link to="/ten-minute">
  <button
    className="fixed right-6 bottom-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition duration-200"
    title="See cultural sites near you"
  >
    🕒 10-Minute View
  </button>
</Link>

      )}
    </div>
  );
}
