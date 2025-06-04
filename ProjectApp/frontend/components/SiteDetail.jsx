// SiteDetail component
export default function SiteDetail({ place }) {
  return (
    <div>
      <h3>{place.name}</h3>
      <p>Category: {place.category}</p>
      {place.operator && <p>Operator: {place.operator}</p>}
      {place.website && (
        <p>
          Website: <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a>
        </p>
      )}
      {place.wheelchair && <p>Wheelchair Accessibility: {place.wheelchair}</p>}
      {place.address && (
        <p>
          Address: {place.address.street} {place.address.housenumber}, {place.address.postcode} {place.address.city}
        </p>
      )}
    </div>
  );
}
