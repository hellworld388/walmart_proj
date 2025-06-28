const db = require("../db");
const axios = require("axios");

exports.getDistance = async (req, res) => {
  const id1 = parseInt(req.params.id1);  // supplier_id
  const id2 = parseInt(req.params.id2);  // warehouse_id
  const transportMode = req.query.mode;

  if (isNaN(id1) || isNaN(id2) || !transportMode) {
    return res.status(400).json({ error: 'Invalid ID(s) or missing transport mode' });
  }

  const getCoords = async (table, id) => {
    const idField = table === "suppliers" ? "supplier_id" : "warehouse_id";
    const result = await db.query(
      `SELECT latitude, longitude FROM ${table} WHERE ${idField} = $1`, [id]
    );
    if (result.rows.length === 0) throw new Error(`${table} ID ${id} not found`);
    return result.rows[0];
  };

  try {
    const source = await getCoords("suppliers", id1);     // From supplier
    const destination = await getCoords("warehouses", id2); // To warehouse
    const tmRes = await db.query(`SELECT * FROM transport_modes WHERE mode_type = $1`, [transportMode]);
    const tm = tmRes.rows[0];
    if (!tm) return res.status(400).json({ error: "Invalid transport mode" });

    let distanceKm, durationMin, routeCoords = [];

    if (transportMode === "air") {
      // Haversine formula
      const toRad = deg => deg * (Math.PI / 180);
      const R = 6371;
      const dLat = toRad(destination.latitude - source.latitude);
      const dLon = toRad(destination.longitude - source.longitude);
      const lat1 = toRad(source.latitude);
      const lat2 = toRad(destination.latitude);

      const aFormula = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(aFormula), Math.sqrt(1 - aFormula));
      distanceKm = R * c;
      durationMin = Math.ceil((distanceKm / 800) * 60);  // 800 km/h flight speed assumption
      routeCoords = [[source.latitude, source.longitude], [destination.latitude, destination.longitude]];
    } else {
      // Driving route via OpenRouteService
      const coordinates = [[source.longitude, source.latitude], [destination.longitude, destination.latitude]];
      const orsRes = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        { coordinates },
        {
          headers: {
            Authorization: "5b3ce3597851110001cf6248e9a10a857c964fccb28481078bd6c079",
            "Content-Type": "application/json",
          },
        }
      );
      const summary = orsRes.data.features[0].properties.summary;
      const rawCoords = orsRes.data.features[0].geometry.coordinates;
      routeCoords = rawCoords.map(([lng, lat]) => [lat, lng]);
      distanceKm = summary.distance / 1000;
      durationMin = Math.ceil(summary.duration / 60);
    }

    const estimated_cost = (
      distanceKm * tm.base_cost_per_km * tm.sustainability_multiplier + tm.setup_cost
    ).toFixed(2);

    res.json({
      distance_km: distanceKm.toFixed(2),
      duration_min: durationMin,
      estimated_cost,
      route: routeCoords
    });

  } catch (err) {
    console.error("ORS Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Distance calculation failed" });
  }
};
