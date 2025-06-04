// Home page
import { useQuery } from '@apollo/client';
import { GET_PLACES } from '../services/graphql';
import MapView from '../components/MapView';
import ListView from '../components/ListView';
import { useState } from 'react';

export default function Home() {
  const { loading, error, data } = useQuery(GET_PLACES);
  const [filter, setFilter] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredPlaces = data.getPlaces.filter(place =>
    place.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <MapView places={filteredPlaces} />
      <ListView places={filteredPlaces} />
    </div>
  );
}