import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { RouteOptimizer } from '../components/RouteOptimizer';
import { warehouses, suppliers, products, transportModes } from '../data/mockData';
import { calculateDistance } from '../utils/calculations';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Warehouse, 
  Truck,
  RefreshCw,
  MapPin,
  DollarSign
} from 'lucide-react';

export function ManagerDashboard() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);
  const [showReorderModal, setShowReorderModal] = useState<{
    product: any;
    inventory: any;
  } | null>(null);

  // Calculate dashboard metrics
  const totalProducts = selectedWarehouse.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = selectedWarehouse.inventory.filter(item => item.quantity <= item.reorderLevel);
  const outOfStockItems = selectedWarehouse.inventory.filter(item => item.quantity === 0);

  const recentActivity = [
    { action: 'Restocked', product: 'EcoBook Pro Laptop', quantity: 15, time: '2 hours ago' },
    { action: 'Low Stock Alert', product: 'GreenPhone X1', quantity: 8, time: '4 hours ago' },
    { action: 'Order Placed', product: 'EcoTab Plus', quantity: 20, time: '1 day ago' },
  ];

  const handleReorder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const inventory = selectedWarehouse.inventory.find(i => i.productId === productId);
    if (product && inventory) {
      setShowReorderModal({ product, inventory });
    }
  };

  return (
    <Layout userRole="manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage inventory and optimize supply chain</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedWarehouse.id}
              onChange={(e) => setSelectedWarehouse(warehouses.find(w => w.id === e.target.value)!)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
            >
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="text-primary-600" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-warning-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="text-warning-600" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-error-600">{outOfStockItems.length}</p>
              </div>
              <RefreshCw className="text-error-600" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-secondary-600">{suppliers.length}</p>
              </div>
              <Truck className="text-secondary-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Warehouse className="mr-2" size={20} />
              {selectedWarehouse.name} Inventory
            </h3>
            
            <div className="space-y-4">
              {selectedWarehouse.inventory.map(inventoryItem => {
                const product = products.find(p => p.id === inventoryItem.productId);
                if (!product) return null;
                
                const isLowStock = inventoryItem.quantity <= inventoryItem.reorderLevel;
                const isOutOfStock = inventoryItem.quantity === 0;
                
                return (
                  <div key={inventoryItem.productId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOutOfStock ? 'bg-error-100 text-error-700' :
                          isLowStock ? 'bg-warning-100 text-warning-700' :
                          'bg-secondary-100 text-secondary-700'
                        }`}>
                          {inventoryItem.quantity} units
                        </span>
                        
                        {(isLowStock || isOutOfStock) && (
                          <button
                            onClick={() => handleReorder(product.id)}
                            className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Reorder Level: {inventoryItem.reorderLevel} units</p>
                      <p>Last Restocked: {inventoryItem.lastRestocked}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.quantity} units</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Network */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="mr-2" size={20} />
            Supplier Network
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map(supplier => {
              const distance = calculateDistance(
                selectedWarehouse.coordinates,
                supplier.coordinates
              );
              
              return (
                <div key={supplier.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                    <div className="flex items-center space-x-1 text-secondary-600">
                      <span className="text-sm font-medium">{supplier.sustainabilityScore}%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{supplier.location}</p>
                  <p className="text-sm text-gray-600 mb-2">{Math.round(distance)} km away</p>
                  
                  <div className="text-xs text-gray-500">
                    Products: {supplier.products.length} available
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reorder Modal */}
      {showReorderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Reorder: {showReorderModal.product.name}
              </h2>
              <button
                onClick={() => setShowReorderModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Current Stock: {showReorderModal.inventory.quantity} units
              </p>
              <p className="text-gray-600 mb-4">
                Reorder Level: {showReorderModal.inventory.reorderLevel} units
              </p>
              
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-4">
                <p className="text-warning-800 font-medium">
                  Recommended order quantity: {showReorderModal.inventory.reorderLevel * 2} units
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Available Suppliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers
                  .filter(supplier => supplier.products.includes(showReorderModal.product.id))
                  .map(supplier => {
                    const distance = calculateDistance(
                      selectedWarehouse.coordinates,
                      supplier.coordinates
                    );
                    
                    return (
                      <div key={supplier.id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{supplier.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{supplier.location}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Distance: {Math.round(distance)} km</span>
                          <span className="text-secondary-600">
                            Sustainability: {supplier.sustainabilityScore}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <RouteOptimizer
              origin={selectedWarehouse.coordinates}
              destination={suppliers[0].coordinates}
              product={showReorderModal.product}
              transportModes={transportModes}
              quantity={showReorderModal.inventory.reorderLevel * 2}
            />
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowReorderModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle order placement
                  setShowReorderModal(null);
                  alert('Order placed successfully!');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}