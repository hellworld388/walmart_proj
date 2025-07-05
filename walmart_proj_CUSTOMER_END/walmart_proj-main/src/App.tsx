import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomerShop } from './pages/CustomerShop';
import { ManagerDashboard } from './pages/ManagerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CustomerShop />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;