// React Leaflet MapView component
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ places }) {
  return (
    <MapContainer center={[50.83, 12.92]} zoom={13} style={{ height: '80vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {places.map(place => (
        <Marker
          key={place._id}
          position={[place.geometry.coordinates[1], place.geometry.coordinates[0]]}
        >
          <Popup>
            <strong>{place.name}</strong><br />
            Category: {place.category}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
