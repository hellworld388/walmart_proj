import React from 'react';
import { Product, InventoryItem } from '../types';
import { ShoppingCart, Package, Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  inventory?: InventoryItem;
  warehouseName?: string;
  onAddToCart?: (productId: string, warehouseId?: string) => void;
  warehouseId?: string;
  showInventory?: boolean;
}

export function ProductCard({ 
  product, 
  inventory, 
  warehouseName, 
  onAddToCart, 
  warehouseId,
  showInventory = false 
}: ProductCardProps) {
  const isLowStock = inventory && inventory.quantity <= inventory.reorderLevel;
  const isOutOfStock = inventory && inventory.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <Leaf size={12} />
          <span>{product.recyclabilityIndex}%</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ₹{product.basePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        {showInventory && inventory && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Stock:</span>
              <span className={`text-sm font-medium ${
                isOutOfStock ? 'text-error-600' : 
                isLowStock ? 'text-warning-600' : 'text-secondary-600'
              }`}>
                {inventory.quantity} units
              </span>
            </div>
            {isLowStock && !isOutOfStock && (
              <div className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                Low stock - Reorder recommended
              </div>
            )}
            {isOutOfStock && (
              <div className="text-xs text-error-600 bg-error-50 px-2 py-1 rounded">
                Out of stock - Immediate reorder required
              </div>
            )}
          </div>
        )}

        {warehouseName && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Package size={14} className="mr-1" />
            <span>Available at {warehouseName}</span>
          </div>
        )}

        {onAddToCart && !isOutOfStock && (
          <button
            onClick={() => onAddToCart(product.id, warehouseId)}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        )}

        {isOutOfStock && (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}