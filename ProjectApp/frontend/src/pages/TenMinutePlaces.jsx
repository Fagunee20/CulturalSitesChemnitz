import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { UPDATE_USER_LOCATION } from '../services/graphql'; // Make sure this is defined

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GET_NEARBY_PLACES = gql`
  query GetNearbyPlaces($lat: Float!, $lng: Float!, $radius: Float!) {
    getNearbyPlaces(lat: $lat, lng: $lng, radius: $radius) {
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

export default function TenMinutePlaces() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(800);
  const [getNearbyPlaces, { data, loading, error }] = useLazyQuery(GET_NEARBY_PLACES);
  const [updateUserLocation] = useMutation(UPDATE_USER_LOCATION);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Got coordinates:", latitude, longitude);
        setLocation({ lat: latitude, lng: longitude });

        try {
          await updateUserLocation({
            variables: {
              lat: parseFloat(latitude),
              lng: parseFloat(longitude),
            },
          });
          console.log("✅ Location updated in DB");
        } catch (err) {
          console.error("❌ Failed to update location:", err.message);
        }

        console.log("Calling getNearbyPlaces with:", {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          radius,
        });

        getNearbyPlaces({
          variables: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            radius,
          },
        });
      },
      (err) => {
        alert('⚠️ Failed to get location: ' + err.message);
      }
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Cultural Places within 10 Minutes</h2>

      <div className="flex gap-2 mb-4">
        <select
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={800}>🚶 Walk (800m)</option>
          <option value={3000}>🚴 Bike (3km)</option>
          <option value={5000}>🚍 Public Transport (5km)</option>
        </select>
        <button
          onClick={handleGetLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Use My Location
        </button>
      </div>

      {loading && <p>Loading nearby places...</p>}
      {error && <p className="text-red-500">❌ {error.message}</p>}

      {location && data?.getNearbyPlaces?.length > 0 && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          className="h-96 w-full rounded shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here</Popup>
          </Marker>
          {data.getNearbyPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.location?.lat ?? 0, place.location?.lng ?? 0]}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                Category: {place.category}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {location && data?.getNearbyPlaces?.length === 0 && !loading && (
        <p>No cultural places found within the selected radius.</p>
      )}
    </div>
  );
}
