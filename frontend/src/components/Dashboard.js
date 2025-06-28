import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // Import styles

function Dashboard({ manager, onReorder }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (manager?.warehouse_id) {
      axios.get(`http://localhost:3000/alerts/${manager.warehouse_id}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error("Failed to fetch alerts:", err));
    }
  }, [manager]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {manager.name}</h2>
      <h3>Products Low in Stock</h3>

      {products.length === 0 ? (
        <p>No low-stock alerts. All products are above threshold.</p>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div className="product-card" key={p.product_id}>
              <img
                src={p.image_url}
                alt={p.name}
                className="product-image"
              />
              <h4>{p.name}</h4>
              <p><strong>Price:</strong> ₹{p.price}</p>
              <p><strong>Stock:</strong> {p.current_stock} / Threshold: {p.min_threshold}</p>
              <p><strong>Sustainability Score:</strong> {p.current_score ?? 'N/A'}</p>
              <button className="reorder-button" onClick={() => onReorder(p)}>
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
