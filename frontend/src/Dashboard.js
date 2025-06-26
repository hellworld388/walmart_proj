import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ manager, onReorder }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/alerts/${manager.supplier_id}`)
      .then(res => setProducts(res.data));
  }, [manager]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Welcome, {manager.name}</h2>
      <h3>Products Low in Stock</h3>

      {products.length === 0 ? (
        <p>No low-stock alerts. All products are above threshold.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {products.map(p => (
            <div
              key={p.product_id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                width: 'calc(50% - 20px)',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={p.image_url}
                alt={p.name}
                style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '12px' }}
              />
              <h4>{p.name}</h4>
              <p><strong>Price:</strong> ₹{p.price}</p>
              <p><strong>Stock:</strong> {p.current_stock} / Threshold: {p.min_threshold}</p>
              <p><strong>Sustainability Score:</strong> {p.current_score ?? 'N/A'}</p>
              <button onClick={() => onReorder(p)} style={{ padding: '8px 12px', marginTop: '8px' }}>
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
