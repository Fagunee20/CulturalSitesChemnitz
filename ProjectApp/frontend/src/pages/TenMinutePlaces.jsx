import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import 'leaflet/dist/leaflet.css';
import { UPDATE_USER_LOCATION } from '../services/graphql';
import TenMinuteMapView from '../components/TenMinuteMapView';

const GET_NEARBY_PLACES = gql`
  query GetNearbyPlaces($lat: Float!, $lng: Float!, $radius: Float!) {
    getNearbyPlaces(lat: $lat, lng: $lng, radius: $radius) {
      id
      name
      type
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
        setLocation({ lat: latitude, lng: longitude });

        try {
          await updateUserLocation({
            variables: {
              lat: parseFloat(latitude),
              lng: parseFloat(longitude),
            },
          });
        } catch (err) {
          console.error("Failed to update location:", err.message);
        }

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
    <div className="ten-minute-wrapper">
      <h2>Cultural Places within 10 Minutes</h2>

      <div className="location-controls">
        <select
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
        >
          <option value={800}>🚶 Walk (800m)</option>
          <option value={3000}>🚴 Bike (3km)</option>
          <option value={5000}>🚍 Public Transport (5km)</option>
        </select>
        <button onClick={handleGetLocation}>
          {location ? 'Refresh Location' : 'Use My Location'}
        </button>
      </div>

      {location && (
        <p className="status-message success">
          📍 You are here: ({location.lat.toFixed(5)}, {location.lng.toFixed(5)})
        </p>
      )}

      {loading && <p>Loading nearby places...</p>}
      {error && <p className="status-message error">❌ {error.message}</p>}

      {data?.getNearbyPlaces?.length > 0 ? (
        <TenMinuteMapView places={data.getNearbyPlaces} userLocation={location} />
      ) : (
        !loading &&
        location && <p>No cultural places found within the selected radius.</p>
      )}

      {!location && (
        <p>Please click "Use My Location" and allow location access to see nearby cultural places.</p>
      )}
    </div>
  );
}
