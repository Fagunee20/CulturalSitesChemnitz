// SiteDetail component
export default function SiteDetail({ place }) {
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">{place.name}</h3>
      <p><strong>Category:</strong> {place.category}</p>

      {place.operator && <p><strong>Operator:</strong> {place.operator}</p>}

      {place.website && (
        <p>
          <strong>Website:</strong>{' '}
          <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {place.website}
          </a>
        </p>
      )}

      {place.wheelchair && (
        <p><strong>Wheelchair Accessibility:</strong> {place.wheelchair}</p>
      )}

      {place.address && (
        <p>
          <strong>Address:</strong>{' '}
          {place.address.street} {place.address.housenumber}, {place.address.postcode} {place.address.city}
        </p>
      )}
    </div>
  );
}

