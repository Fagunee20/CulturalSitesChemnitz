import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function TenMinuteMapView({ userLocation, nearbyPlaces }) {
  if (!userLocation) {
    return <p>Please allow location access and click "Use My Location" to see nearby places.</p>;
  }

  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return <p>No cultural places found within the selected radius.</p>;
  }

  // Center map on user's current location
  const center = [userLocation.lat, userLocation.lng];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '80vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marker for user's location */}
      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Markers for nearby cultural places */}
      {nearbyPlaces.map((place) => {
        const lat = place.location?.lat;
        const lng = place.location?.lng;

        if (typeof lat !== 'number' || typeof lng !== 'number') return null;

        return (
          <Marker key={place.id} position={[lat, lng]}>
            <Popup>
              <strong>{place.name}</strong><br />
              Category: {place.category}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
