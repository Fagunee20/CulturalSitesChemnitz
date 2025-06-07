// Updated ListView component with working Add to Favorites
import React from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_FAVORITE = gql`
  mutation AddFavorite($placeId: ID!) {
    addFavorite(placeId: $placeId)
  }
`;

export default function ListView({ places }) {
  const [addFavorite] = useMutation(ADD_FAVORITE, {
    refetchQueries: ['GetFavorites'],
    awaitRefetchQueries: true,
  });

  const handleAddFavorite = async (placeId) => {
    try {
      await addFavorite({ variables: { placeId } });
      alert('✅ Added to favorites');
    } catch (err) {
      alert('❌ Error adding to favorites: ' + err.message);
    }
  };

  return (
    <ul>
      {places.map(place => (
        <li key={place.id} style={{ marginBottom: '1rem' }}>
          <strong>{place.name}</strong> – {place.category}
          <button onClick={() => handleAddFavorite(place.id)} style={{ marginLeft: '1rem' }}>
            ❤️ Add to Favorites
          </button>
        </li>
      ))}
    </ul>
  );
}
