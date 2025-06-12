// pages/VisitedPlaces.jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_VISITED_PLACES } from '../services/graphql';

export default function VisitedPlaces() {
  const { data, loading, error } = useQuery(GET_VISITED_PLACES);

  if (loading) return <p>Loading visited places...</p>;
  if (error) {
    console.error(error);
    return <p>Error loading visited places</p>;
  } 

  if (!data || !data.getVisitedPlaces || data.getVisitedPlaces.length === 0) {
    return <p>No places marked as visited yet.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Visited Places</h2>
      <ul className="space-y-2">
        {data.getVisitedPlaces.map((entry) => (
          <li key={entry.place.id} className="bg-gray-100 p-3 rounded shadow">
            <Link to={`/place/${entry.place.id}`}>
              <strong>{entry.place.name}</strong> - {entry.place.category} ({entry.place.address?.city || 'Unknown City'}, {entry.mode})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
