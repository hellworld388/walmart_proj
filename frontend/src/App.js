import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ReorderPage from './components/ReorderPage';
import MapPage from './components/MapPage';

function App() {
  const [manager, setManager] = useState(null);
  const [page, setPage] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [routeData, setRouteData] = useState(null); // Includes supplier, warehouse, mode

  const handleLogin = (mgr) => {
    setManager(mgr);
    setPage('dashboard');
  };

  const handleReorder = (product) => {
    setSelectedProduct(product);
    setPage('reorder');
  };

  const handleOrderPlaced = ({ supplierCoords, warehouseCoords, transportMode }) => {
    setRouteData({ supplierCoords, warehouseCoords, transportMode });
    setPage('map');
  };

  const handleBackToDashboard = () => {
    setSelectedProduct(null);
    setRouteData(null);
    setPage('dashboard');
  };

  return (
    <div>
      {page === 'login' && <LoginPage onLogin={handleLogin} />}

      {page === 'dashboard' && manager && (
        <Dashboard manager={manager} onReorder={handleReorder} />
      )}

      {page === 'reorder' && selectedProduct && manager && (
        <ReorderPage
          product={selectedProduct}
          manager={manager}
          onOrderPlaced={handleOrderPlaced}
          onCancel={handleBackToDashboard}
        />
      )}

      {page === 'map' && routeData && (
        <MapPage
          supplierCoords={routeData.supplierCoords}
          warehouseCoords={routeData.warehouseCoords}
          transportMode={routeData.transportMode}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
