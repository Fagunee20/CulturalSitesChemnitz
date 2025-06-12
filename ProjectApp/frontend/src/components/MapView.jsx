// components/MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { markerIcons } from './markerIcons'; // ✅ Custom icons

// Fix Leaflet's default icon URLs for Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ places, userLocation }) {
  const navigate = useNavigate();

  if (!places || places.length === 0) {
    return <p>No places to show.</p>;
  }

  const firstPlace = places.find(
    (p) =>
      typeof p.location?.lat === 'number' &&
      typeof p.location?.lng === 'number'
  );

  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : firstPlace
    ? [firstPlace.location.lat, firstPlace.location.lng]
    : [50.83, 12.92]; // fallback

  const handleViewDetails = (id) => {
    navigate(`/place/${id}`);
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '80vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* ✅ Gray "You are here" marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={markerIcons.user}
        >
          <Popup>📍 You are here</Popup>
        </Marker>
      )}

      {places.map((place) => {
        const lat = place.location?.lat;
        const lng = place.location?.lng;

        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null;
        }

        const category = place.type?.toLowerCase();
        const icon =
          category === 'restaurant'
            ? markerIcons.restaurant
            : category === 'museum'
            ? markerIcons.museum
            : category === 'theatre'
            ? markerIcons.theatre
            : category === 'artwork'
            ? markerIcons.artwork
            : markerIcons.default;

        return (
          <Marker key={place.id} position={[lat, lng]} icon={icon}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              Category: {place.type}
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
