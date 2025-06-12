// pages/Favorites.jsx
import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GET_FAVORITES } from '../services/graphql';

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($placeId: ID!) {
    removeFavorite(placeId: $placeId)
  }
`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Favorites() {
  const { loading, error, data } = useQuery(GET_FAVORITES);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: true,
  });

  const handleRemove = async (placeId) => {
    try {
      await removeFavorite({ variables: { placeId } });
      alert('❌ Removed from favorites!');
    } catch (err) {
      alert('⚠️ ' + err.message);
    }
  };

  const favorites = data?.getFavorites || [];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Favorite Places</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
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
              {favorites.map((place) => (
                <tr key={place.id} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{place.name}</td>
                  <td className="border px-2 py-1">{place.type}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleRemove(place.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      💔 Remove
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
            {favorites.map((place) =>
              place.location && (
                <Marker key={place.id} position={[place.location.lat, place.location.lng]}>
                  <Popup>
                    <strong>{place.name}</strong><br />
                    Category: {place.type}
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </>
      )}
    </div>
  );
}
