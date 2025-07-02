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
    <div className="favorite-page">
      <h1>Your Favorite Places</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red">Error: {error.message}</p>}

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <>
          <table className="favorites-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((place) => (
                <tr key={place.id}>
                  <td>{place.name}</td>
                  <td>{place.type}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(place.id)}
                      className="remove-btn"
                    >
                       Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <MapContainer center={[50.83, 12.92]} zoom={13}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {favorites.map(
              (place) =>
                place.location && (
                  <Marker
                    key={place.id}
                    position={[place.location.lat, place.location.lng]}
                  >
                    <Popup>
                      <strong>{place.name}</strong>
                      <br />
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
