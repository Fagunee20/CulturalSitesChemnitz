// ListView component
import React from 'react';
export default function ListView({ places, onAddFavorite }) {
  return (
    <ul>
      {places.map(place => (
        <li key={place.id} style={{ marginBottom: '1rem' }}>
          <strong>{place.name}</strong> – {place.category}
          {onAddFavorite && (
            <button onClick={() => onAddFavorite(place.id)} style={{ marginLeft: '1rem' }}>
              ❤️ Add to Favorites
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}