import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapPage.css";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons
const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [30, 30],
});

const orangeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [30, 30],
});

function MapPage({ supplierCoords, warehouseCoords, transportMode, onBackToDashboard }) {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [cost, setCost] = useState(null);

  useEffect(() => {
    if (!supplierCoords || !warehouseCoords || !transportMode) return;

    const supplier_id = supplierCoords.supplier_id;

    const warehouse_id = warehouseCoords.warehouse_id;

    axios
      .get(`http://localhost:3000/distance/${supplier_id}/${warehouse_id}?mode=${transportMode}`)
      .then((res) => {
        setRoute(res.data.route);
        setDistance(res.data.distance_km);
        setDuration(res.data.duration_min);
        setCost(res.data.estimated_cost);
      })
      .catch((err) => console.error("Route error", err));
  }, [supplierCoords, warehouseCoords, transportMode]);

  return (
    <div className="map-wrapper">
      <h2 className="map-title">🚚 Delivery Route</h2>

      {distance && (
        <div className="map-info">
          Distance: {distance} km | Duration: {duration} mins | Cost (₹): {cost}
        </div>
      )}

      <MapContainer
        center={[supplierCoords.lat, supplierCoords.lng]}
        zoom={6}
        className="leaflet-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[supplierCoords.lat, supplierCoords.lng]} icon={yellowIcon}>
          <Popup><b>Supplier</b></Popup>
        </Marker>

        <Marker position={[warehouseCoords.latitude, warehouseCoords.longitude]} icon={orangeIcon}>
          <Popup><b>Warehouse:</b> {warehouseCoords.name}</Popup>
        </Marker>

        {route.length > 0 && <Polyline positions={route} color="red" weight={5} />}
      </MapContainer>

      <div className="back-button-container">
        <button onClick={onBackToDashboard}>⬅️ Back to Dashboard</button>
      </div>
    </div>
  );
}

export default MapPage;
