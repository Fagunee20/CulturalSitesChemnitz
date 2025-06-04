// ListView component
export default function ListView({ places }) {
  return (
    <ul>
      {places.map(place => (
        <li key={place._id}>{place.name} - {place.category}</li>
      ))}
    </ul>
  );
}