import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReorderPage.css';

function ReorderPage({ product, manager, onOrderPlaced, onCancel }) {
  const [suppliers, setSuppliers] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [transportMode, setTransportMode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  // Fetch suppliers and transport modes once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [suppliersRes, transportRes] = await Promise.all([
          axios.get(`http://localhost:3000/suppliers/${product.product_id}`),
          axios.get('http://localhost:3000/transport-modes')
        ]);
        setSuppliers(suppliersRes.data);
        setTransportModes(transportRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error loading suppliers or transport options");
      }
    };

    fetchOptions();
  }, [product]);

  const handleFetchSuggestions = async () => {
    if (!supplierId || quantity < 1) {
      alert("Please select a supplier and enter a valid quantity");
      return;
    }

    try {
      setSuggestionLoading(true);
      const res = await axios.post('http://localhost:3000/suggest/suggest-modes', {
        supplier_id: Number(supplierId),
        warehouse_id: Number(manager.warehouse_id),
        product_id: Number(product.product_id),
        quantity: Number(quantity)
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Suggestion error:", err);
      alert("Failed to fetch suggestions.");
      setSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!supplierId || !transportMode || quantity < 1) {
      alert("Please fill all fields correctly");
      return;
    }

    const selectedSupplier = suppliers.find(s => s.supplier_id === Number(supplierId));
    if (!selectedSupplier) {
      alert("Invalid supplier selected");
      return;
    }

    if (Number(quantity) > selectedSupplier.current_stock) {
      alert(`Only ${selectedSupplier.current_stock} units available from this supplier.`);
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/order', {
        supplier_id: Number(supplierId),
        warehouse_id: Number(manager.warehouse_id),
        product_id: Number(product.product_id),
        quantity: Number(quantity),
        transport_mode: transportMode
      });

      onOrderPlaced({
        supplierCoords: {
          supplier_id: selectedSupplier.supplier_id,
          lat: selectedSupplier.latitude,
          lng: selectedSupplier.longitude
        },
        warehouseCoords: {
          warehouse_id: manager.warehouse_id,
          latitude: manager.latitude,
          longitude: manager.longitude,
          name: manager.name
        },
        transportMode
      });

    } catch (err) {
      console.error("Order error:", err);
      alert("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reorder-container">
      <h2>🚚 Reorder Product</h2>
      <p><strong>Product:</strong> {product.name}</p>

      <div className="form-group">
        <label>📦 Select Supplier</label>
        <select
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
          className="reorder-select"
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map(s => (
            <option key={s.supplier_id} value={s.supplier_id}>
              {s.name} ({s.current_stock} in stock)
            </option>
          ))}
        </select>
        {suppliers.length === 0 && <p className="no-options">No suppliers available for this product.</p>}
      </div>

      <div className="form-group">
        <label>🔢 Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="reorder-input"
        />
      </div>

      <div className="form-group">
        <button onClick={handleFetchSuggestions} disabled={!supplierId || quantity < 1}>
          🔍 Get Suggestions
        </button>
      </div>

      {suggestionLoading && <p>Loading suggestions...</p>}

      <div className="form-group">
        <label>🚛 Transport Mode</label>
        <select
          value={transportMode}
          onChange={e => setTransportMode(e.target.value)}
          className="reorder-select"
        >
          <option value="">-- Select Mode --</option>
          {transportModes.map(t => (
            <option key={t.mode_type} value={t.mode_type}>
              {t.mode_type} (Multiplier: {t.sustainability_multiplier})
            </option>
          ))}
        </select>
      </div>

      {suggestions?.modes?.length > 0 && (
        <div className="suggestions-section">
          {suggestions.modes.map((s, idx) => (
            <div
              key={idx}
              className={`suggestion-card ${s.is_best ? 'highlight' : ''}`}
              onClick={() => setTransportMode(s.mode)}
              style={{ cursor: 'pointer' }}
            >
              <p><strong>Mode:</strong> {s.mode}</p>
              <p><strong>Cost:</strong> ₹{s.estimated_cost}</p>
              <p><strong>Distance:</strong> {s.distance_km} km</p>
              <p><strong>Sustainability Score:</strong> {s.sustainability_score}</p>
              {s.is_best && <p className="best-label">🌱 Best Option</p>}
            </div>
          ))}
        </div>
      )}


      <div className="reorder-buttons">
        <button onClick={handleOrder} disabled={loading}>
          {loading ? 'Placing Order...' : '✅ Place Order'}
        </button>
        <button onClick={onCancel} className="cancel-btn">
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}

export default ReorderPage;
