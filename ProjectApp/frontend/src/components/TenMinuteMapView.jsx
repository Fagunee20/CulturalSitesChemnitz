// components/MapViewWithDistanceAndUser.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { markerIcons } from './markerIcons';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default Leaflet marker issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Distance calculation (Haversine)
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

// Travel time estimate (walk, bike, public)
const estimateTravelTime = (distanceKm, mode = 'walk') => {
  const speeds = {
    walk: 5,
    bike: 15,
    public: 25,
  };
  const speed = speeds[mode] || speeds.walk;
  const minutes = Math.round((distanceKm / speed) * 60);
  return minutes;
};

export default function MapViewWithDistanceAndUser({ places, userLocation, mode }) {
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
    : [50.83, 12.92];

  const handleViewDetails = (id) => {
    navigate(`/place/${id}`);
  };

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={markerIcons.user}
          >
            <Popup>📍 You are here</Popup>
          </Marker>
        )}

        {/* Cultural Places Markers */}
        {places.map((place) => {
          const lat = place.location?.lat;
          const lng = place.location?.lng;

          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

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

          let distanceText = '';
          if (userLocation) {
            const distance = haversineDistance(userLocation, { lat, lng });
            const minutes = estimateTravelTime(distance, mode);
            distanceText = `${distance.toFixed(2)} km • approx. ${minutes} min ${mode}`;
          }

          return (
            <Marker key={place.id} position={[lat, lng]} icon={icon}>
              <Popup>
                <strong>{place.name}</strong>
                <br />
                Category: {place.type}
                {userLocation && (
                  <>
                    <br />
                    <em>{distanceText}</em>
                  </>
                )}
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
    </div>
  );
}
