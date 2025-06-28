export interface Supplier {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  products: string[];
  rating: number;
  sustainabilityScore: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  managerId: string;
  inventory: InventoryItem[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  recyclabilityIndex: number;
  basePrice: number;
  image: string;
  description: string;
}

export interface InventoryItem {
  productId: string;
  quantity: number;
  reorderLevel: number;
  lastRestocked: string;
}

export interface TransportMode {
  id: string;
  name: string;
  type: 'road' | 'rail' | 'air' | 'sea';
  costPerKm: number;
  setupCost: number;
  sustainabilityMultiplier: number;
  maxDistance: number;
  icon: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingMethod?: TransportMode;
  sustainability: {
    score: number;
    savingsMessage: string;
  };
}

export interface OrderItem {
  productId: string;
  quantity: number;
  warehouseId: string;
  price: number;
}

export interface RouteOptimization {
  route: string;
  totalCost: number;
  sustainabilityScore: number;
  estimatedTime: string;
  transportMode: TransportMode;
  distance: number;
}