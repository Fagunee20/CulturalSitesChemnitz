// Favorites page
// pages/Favorites.jsx
import { useQuery } from '@apollo/client';
import { GET_FAVORITES } from '../services/graphql';

export default function Favorites() {
  const { loading, error, data } = useQuery(GET_FAVORITES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {data.getFavorites.map(site => (
          <li key={site._id}>{site.name} - {site.category}</li>
        ))}
      </ul>
    </div>
  );
}