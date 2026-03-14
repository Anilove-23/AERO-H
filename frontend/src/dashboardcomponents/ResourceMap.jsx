import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
const ambulanceIcon = new L.Icon({
  iconUrl: "src/components/icons/ambulance.png", 
  iconSize: [35, 35],
});const hospitalIcon = new L.Icon({
  iconUrl: 'src/components/icons/hospital.png', 
  iconSize: [30,30],
});
const FollowUser = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(
        [userLocation.lat, userLocation.lng],
        map.getZoom(),
        { animate: true }
      );
    }
  }, [userLocation, map]);

  return null;
};

const MapClickHandler = ({ setEmergencies }) => {
  useMapEvents({
    click(e) {
      setEmergencies((prev) => [
        ...prev,
        {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        },
      ]);
    },
  });
  return null;
};

const ResourceMap = ({
  emergencies,
  setEmergencies,
  userLocation,
  hospitals,
}) => {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={13}
      className=" h-[calc(100vh-160px)] w-full rounded-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapClickHandler setEmergencies={setEmergencies} />
      <FollowUser userLocation={userLocation} />

      {userLocation && (
        <Marker icon={ambulanceIcon}position={[userLocation.lat, userLocation.lng]}>
          <Popup>📍 User / Ambulance Live Location</Popup>
        </Marker>
      )}

      {emergencies.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]}>
          <Popup>🚨 Emergency</Popup>
        </Marker>
      ))}

      {hospitals.map((h) => (
        <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
          <Popup>
            🏥 {h.name}
            <br />
            ICU Beds: {h.icuBeds}
            <br />
            Distance: {h.distance.toFixed(2)} km
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ResourceMap;