import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { products, warehouses } from '../data/mockData';
import { Search, Filter, ShoppingCart, MapPin } from 'lucide-react';

export function CustomerShop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Array<{productId: string, warehouseId: string, quantity: number}>>([]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const availableProducts = useMemo(() => {
    return products.map(product => {
      const availableWarehouses = warehouses.filter(warehouse => 
        warehouse.inventory.some(item => 
          item.productId === product.id && item.quantity > 0
        )
      );
      
      return {
        ...product,
        availableWarehouses: availableWarehouses.map(wh => ({
          warehouse: wh,
          inventory: wh.inventory.find(item => item.productId === product.id)!
        }))
      };
    }).filter(product => product.availableWarehouses.length > 0);
  }, []);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchTerm, selectedCategory]);

  const handleAddToCart = (productId: string, warehouseId?: string) => {
    if (!warehouseId) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.warehouseId === warehouseId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId && item.warehouseId === warehouseId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, warehouseId, quantity: 1 }];
    });
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout userRole="customer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EcoSupply Store</h1>
            <p className="text-gray-600 mt-1">Sustainable products from multiple warehouses</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg">
            <ShoppingCart size={20} />
            <span className="font-medium">{cartItemsCount} items</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="space-y-4">
              <ProductCard
                product={product}
                inventory={product.availableWarehouses[0]?.inventory}
                warehouseName={product.availableWarehouses[0]?.warehouse.name}
                onAddToCart={handleAddToCart}
                warehouseId={product.availableWarehouses[0]?.warehouse.id}
              />
              
              {/* Alternative Warehouses */}
              {product.availableWarehouses.length > 1 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin size={14} className="mr-1" />
                    Also available at:
                  </h4>
                  <div className="space-y-2">
                    {product.availableWarehouses.slice(1).map(({ warehouse, inventory }) => (
                      <div key={warehouse.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{warehouse.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{inventory.quantity} units</span>
                          <button
                            onClick={() => handleAddToCart(product.id, warehouse.id)}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
}