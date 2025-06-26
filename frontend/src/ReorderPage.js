import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReorderPage({ product, manager, onOrderPlaced }) {
  const [warehouses, setWarehouses] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [warehouseId, setWarehouseId] = useState('');
  const [transportMode, setTransportMode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehousesAndModes = async () => {
      try {
        const [warehousesRes, transportRes] = await Promise.all([
          axios.get(`http://localhost:3000/warehouses/${product.product_id}`),
          axios.get('http://localhost:3000/transport-modes')
        ]);
        setWarehouses(warehousesRes.data);
        setTransportModes(transportRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("Error fetching warehouses or transport modes.");
      }
    };

    fetchWarehousesAndModes();
  }, [product.product_id]);

  const placeOrder = () => {
    if (!warehouseId || !transportMode) {
      alert("Please select both warehouse and transport mode.");
      return;
    }

    const selectedWarehouse = warehouses.find(w => w.warehouse_id === parseInt(warehouseId));

    if (!selectedWarehouse) {
      alert("Invalid warehouse selected.");
      return;
    }

    if (quantity > selectedWarehouse.current_stock) {
      alert(`Order quantity (${quantity}) exceeds warehouse stock (${selectedWarehouse.current_stock}).`);
      return;
    }

    axios.post('http://localhost:3000/order', {
      supplier_id: Number(manager.supplier_id),
      warehouse_id: Number(warehouseId),
      product_id: Number(product.product_id),
      quantity: Number(quantity),
      transport_mode: transportMode
    }).then(() => {
      onOrderPlaced({
        supplierCoords: {
          id: manager.supplier_id,
          lat: manager.latitude,
          lng: manager.longitude
        },
        warehouseCoords: selectedWarehouse,
        transportMode: transportMode
      });
    }).catch(err => {
      alert("Failed to place order.");
      console.error(err);
    });
  };

  if (loading) return <p>Loading options...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h3>Reorder: {product.name}</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Choose Warehouse:</label>
        <select
          value={warehouseId}
          onChange={e => setWarehouseId(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">-- Select --</option>
          {warehouses.map(w => (
            <option key={w.warehouse_id} value={w.warehouse_id}>
              {w.name} (Stock: {w.current_stock})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Transport Mode:</label>
        <select
          value={transportMode}
          onChange={e => setTransportMode(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">-- Select --</option>
          {transportModes.map(tm => (
            <option key={tm.mode_type} value={tm.mode_type}>
              {tm.mode_type} (₹{tm.base_cost_per_km}/km, multiplier: {tm.sustainability_multiplier})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Quantity:</label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={e => setQuantity(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button onClick={placeOrder} style={{ padding: '10px 16px' }}>
        Place Order
      </button>
    </div>
  );
}

export default ReorderPage;
