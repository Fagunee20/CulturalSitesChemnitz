// FavoritePlaces.jsx
import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const SEARCH_PLACES = gql`
  query SearchPlaces($keyword: String!) {
    searchPlaces(keyword: $keyword) {
      id
      name
      category
      location {
        lat
        lng
      }
    }
  }
`;

const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($placeId: ID!) {
    removeFavorite(placeId: $placeId)
  }
`;

const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      id
      name
      category
      location {
        lat
        lng
      }
    }
  }
`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function FavoritePlaces() {
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchPlaces, { data, loading, error }] = useLazyQuery(SEARCH_PLACES);
  const { data: favoritesData } = useQuery(GET_FAVORITES);

  const [addFavorite] = useMutation(ADD_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: true,
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: true,
  });

  const handleSearch = () => {
    if (keyword.trim()) {
      searchPlaces({ variables: { keyword } });
    }
  };

  const isFavorite = (placeId) => {
    return favoritesData?.getFavorites?.some(fav => fav.id === placeId);
  };

  const handleToggleFavorite = async (placeId) => {
    try {
      if (isFavorite(placeId)) {
        await removeFavorite({ variables: { placeId } });
        alert('❌ Removed from favorites!');
      } else {
        await addFavorite({ variables: { placeId } });
        alert('✅ Added to favorites!');
      }
    } catch (err) {
      alert('⚠️ ' + err.message);
    }
  };

  const categoryColors = {
    museum: 'bg-purple-500',
    artwork: 'bg-pink-500',
    gallery: 'bg-yellow-500',
    theatre: 'bg-indigo-500',
    restaurant: 'bg-green-500',
  };

  const filteredResults = data?.searchPlaces?.filter(place =>
    (!categoryFilter || place.category === categoryFilter)
  );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Search Places</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full sm:w-1/2"
          placeholder="Search by name or keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/4"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="museum">Museum</option>
          <option value="artwork">Artwork</option>
          <option value="gallery">Gallery</option>
          <option value="theatre">Theatre</option>
          <option value="restaurant">Restaurant</option>
        </select>
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {filteredResults?.length > 0 && (
        <>
          <table className="w-full text-sm border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Category</th>
                <th className="border px-2 py-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((place) => (
                <tr key={place.id} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{place.name}</td>
                  <td className="border px-2 py-1">
                    <span className={`text-xs text-white px-2 py-1 rounded ${categoryColors[place.category] || 'bg-gray-400'}`}>
                      {place.category}
                    </span>
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleToggleFavorite(place.id)}
                      className={`px-2 py-1 rounded text-white ${isFavorite(place.id) ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                      {isFavorite(place.id) ? '💔 Remove' : '❤️ Add'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <MapContainer center={[50.83, 12.92]} zoom={13} className="h-96 w-full mt-6 rounded shadow">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredResults.map(place => (
              place.location && (
                <Marker
                  key={place.id}
                  position={[place.location.lat, place.location.lng]}
                >
                  <Popup>
                    <strong>{place.name}</strong><br />
                    Category: {place.category}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
}
