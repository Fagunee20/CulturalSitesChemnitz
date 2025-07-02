import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_VISITED_PLACES } from '../services/graphql';


export default function VisitedPlaces() {
  const { data, loading, error } = useQuery(GET_VISITED_PLACES);

  if (loading) return <p className="visited-status">Loading visited places...</p>;
  if (error) {
    console.error(error);
    return <p className="visited-status error">Error loading visited places</p>;
  }

  if (!data || !data.getVisitedPlaces || data.getVisitedPlaces.length === 0) {
    return <p className="visited-status">No places marked as visited yet.</p>;
  }

  return (
    <div className="visited-wrapper">
      <h2>Visited Cultural Places</h2>
      <ul className="visited-list">
        {data.getVisitedPlaces.map((entry) => (
          <li key={entry.place.id} className="visited-item">
            <Link to={`/place/${entry.place.id}`}>
              <strong>{entry.place.name}</strong> - {entry.place.category}{' '}
              <span className="visited-meta">
                ({entry.place.address?.city || 'Unknown City'}, via {entry.mode})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
