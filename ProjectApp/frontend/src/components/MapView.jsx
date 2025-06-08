import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issues with Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ places }) {
  const navigate = useNavigate();

  if (!places || places.length === 0) {
    return <p>No places to show.</p>;
  }

  // Find the first valid place with lat/lng for centering map
  const firstPlace = places.find(
    (p) =>
      typeof p.location?.lat === 'number' &&
      typeof p.location?.lng === 'number'
  );

  // Default center if none found
  const center = firstPlace
    ? [firstPlace.location.lat, firstPlace.location.lng]
    : [50.83, 12.92];

  const handleViewDetails = (id) => {
    navigate(`/place/${id}`);
  };

  console.log('Places passed to MapView:', places);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '80vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {places.map((place) => {
        const lat = place.location?.lat;
        const lng = place.location?.lng;

        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null; // skip invalid locations
        }

        return (
          <Marker key={place.id} position={[lat, lng]}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              Category: {place.category}
              <br />
              <button
                onClick={() => handleViewDetails(place.id)}
                style={{
                  marginTop: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#eee',
                  border: '1px solid #ccc',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                View Details
              </button>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
