import React, { useState, useEffect } from 'react';
import { RouteOptimization, Product, TransportMode } from '../types';
import { optimizeRoute, calculateEcologicalSavings } from '../utils/calculations';
import { Truck, Train, Plane, Clock, DollarSign, Leaf, Award } from 'lucide-react';

interface RouteOptimizerProps {
  origin: [number, number];
  destination: [number, number];
  product: Product;
  transportModes: TransportMode[];
  quantity?: number;
  onRouteSelect?: (route: RouteOptimization) => void;
}

export function RouteOptimizer({ 
  origin, 
  destination, 
  product, 
  transportModes, 
  quantity = 1,
  onRouteSelect 
}: RouteOptimizerProps) {
  const [routes, setRoutes] = useState<RouteOptimization[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOptimization | null>(null);

  useEffect(() => {
    const optimizedRoutes = optimizeRoute(origin, destination, product, transportModes, quantity);
    setRoutes(optimizedRoutes);
    if (optimizedRoutes.length > 0) {
      setSelectedRoute(optimizedRoutes[0]);
    }
  }, [origin, destination, product, transportModes, quantity]);

  const handleRouteSelect = (route: RouteOptimization) => {
    setSelectedRoute(route);
    if (onRouteSelect) {
      onRouteSelect(route);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'road': return <Truck size={20} />;
      case 'rail': return <Train size={20} />;
      case 'air': return <Plane size={20} />;
      default: return <Truck size={20} />;
    }
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return 'text-secondary-600 bg-secondary-50';
    if (score >= 60) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transport Options for {product.name}
        </h3>
        
        {routes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No viable transport routes found for this distance.
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoute === route 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRouteSelect(route)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary-600">
                      {getTransportIcon(route.transportMode.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{route.route}</h4>
                      <p className="text-sm text-gray-600">{route.distance} km</p>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="flex items-center space-x-1 bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs">
                      <Award size={12} />
                      <span>Recommended</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <div>
                      <p className="text-gray-600">Cost</p>
                      <p className="font-medium">₹{route.totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium">{route.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Leaf size={16} className="text-gray-500" />
                    <div>
                      <p className="text-gray-600">Sustainability</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityColor(route.sustainabilityScore)}`}>
                        {route.sustainabilityScore}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoute && (
        <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-2 mb-2">
            <Leaf className="text-secondary-600" size={20} />
            <h4 className="font-medium text-secondary-800">Environmental Impact</h4>
          </div>
          <p className="text-secondary-700 text-sm">
            {calculateEcologicalSavings(selectedRoute, routes)}
          </p>
        </div>
      )}
    </div>
  );
}