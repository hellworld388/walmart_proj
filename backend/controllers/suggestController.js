const db = require("../db");
const axios = require("axios");

exports.suggestModes = async (req, res) => {
    const { supplier_id, warehouse_id, product_id, quantity } = req.body;

    if ([supplier_id, warehouse_id, product_id, quantity].some(x => typeof x !== 'number')) {
        console.log("❌ Invalid input types", { supplier_id, warehouse_id, product_id, quantity });

        return res.status(400).json({ error: "Invalid input" });
    }

    try {
        const [supplierRes, warehouseRes, productRes, modesRes] = await Promise.all([
            db.query(`SELECT latitude, longitude FROM suppliers WHERE supplier_id = $1`, [supplier_id]),
            db.query(`SELECT latitude, longitude, sustainability_rating FROM warehouses WHERE warehouse_id = $1`, [warehouse_id]),
            db.query(`SELECT weight, recyclability_index FROM products WHERE product_id = $1`, [product_id]),
            db.query(`SELECT * FROM transport_modes`)
        ]);

        const supplier = supplierRes.rows[0];
        const warehouse = warehouseRes.rows[0];
        const product = productRes.rows[0];
        const modes = modesRes.rows;

        if (!supplier || !warehouse || !product) {
            return res.status(404).json({ error: "Supplier, warehouse, or product not found" });
        }

        const coordinates = [[supplier.longitude, supplier.latitude], [warehouse.longitude, warehouse.latitude]];
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


        const distanceKm = orsRes.data.features[0].properties.summary.distance / 1000;
        const durationMin = Math.ceil(orsRes.data.features[0].properties.summary.duration / 60);
    
        const results = modes.map((mode) => {
            const estimated_cost =
                distanceKm * mode.base_cost_per_km * mode.sustainability_multiplier + mode.setup_cost;


            const base_score = product.weight * product.recyclability_index;
            const sustainability_score = (base_score * warehouse.sustainability_rating) / (distanceKm * mode.sustainability_multiplier);

            return {
                mode: mode.mode_type,
                distance_km: Number(distanceKm.toFixed(2)),
                duration_min: durationMin,
                estimated_cost: Number(estimated_cost.toFixed(2)),
                sustainability_score: Number(sustainability_score),
            };
        });

        // Find the most optimal one (highest sustainability_score)
        const best = results.reduce((a, b) => (a.sustainability_score > b.sustainability_score ? a : b));
        results.forEach(r => r.is_best = (r.mode === best.mode));

        res.json({ modes: results });
    } catch (err) {
        console.error("Suggest Modes Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Suggestion failed" });
    }
};
