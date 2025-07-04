import { Supplier, Warehouse, Product, TransportMode, InventoryItem } from '../types';

export const suppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'EcoTech Supplies',
    location: 'Mumbai, Maharashtra',
    coordinates: [72.8777, 19.0760],
    products: ['laptop', 'smartphone', 'tablet'],
    rating: 4.5,
    sustainabilityScore: 85
  },
  {
    id: 'sup2',
    name: 'Green Electronics',
    location: 'Bangalore, Karnataka',
    coordinates: [77.5946, 12.9716],
    products: ['smartphone', 'headphones', 'smartwatch'],
    rating: 4.2,
    sustainabilityScore: 92
  },
  {
    id: 'sup3',
    name: 'Sustainable Tech Hub',
    location: 'Delhi, NCR',
    coordinates: [77.1025, 28.7041],
    products: ['laptop', 'tablet', 'monitor'],
    rating: 4.7,
    sustainabilityScore: 88
  }
];

export const warehouses: Warehouse[] = [
  {
    id: 'wh1',
    name: 'Central Warehouse Mumbai',
    location: 'Mumbai, Maharashtra',
    coordinates: [72.8777, 19.0760],
    managerId: 'mgr1',
    inventory: [
      { productId: 'laptop', quantity: 25, reorderLevel: 10, lastRestocked: '2024-01-15' },
      { productId: 'smartphone', quantity: 8, reorderLevel: 15, lastRestocked: '2024-01-10' },
      { productId: 'tablet', quantity: 18, reorderLevel: 12, lastRestocked: '2024-01-12' }
    ]
  },
  {
    id: 'wh2',
    name: 'Tech Hub Bangalore',
    location: 'Bangalore, Karnataka',
    coordinates: [77.5946, 12.9716],
    managerId: 'mgr2',
    inventory: [
      { productId: 'laptop', quantity: 30, reorderLevel: 10, lastRestocked: '2024-01-18' },
      { productId: 'headphones', quantity: 45, reorderLevel: 20, lastRestocked: '2024-01-14' },
      { productId: 'smartwatch', quantity: 12, reorderLevel: 15, lastRestocked: '2024-01-16' }
    ]
  },
  {
    id: 'wh3',
    name: 'North India Distribution',
    location: 'Delhi, NCR',
    coordinates: [77.1025, 28.7041],
    managerId: 'mgr3',
    inventory: [
      { productId: 'monitor', quantity: 22, reorderLevel: 8, lastRestocked: '2024-01-17' },
      { productId: 'tablet', quantity: 35, reorderLevel: 12, lastRestocked: '2024-01-19' },
      { productId: 'laptop', quantity: 5, reorderLevel: 10, lastRestocked: '2024-01-08' }
    ]
  }
];

export const products: Product[] = [
  {
    id: 'laptop',
    name: 'EcoBook Pro Laptop',
    category: 'Electronics',
    recyclabilityIndex: 75,
    basePrice: 85000,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
    description: 'High-performance laptop with sustainable materials'
  },
  {
    id: 'smartphone',
    name: 'GreenPhone X1',
    category: 'Electronics',
    recyclabilityIndex: 68,
    basePrice: 45000,
    image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Eco-friendly smartphone with recycled components'
  },
  {
    id: 'tablet',
    name: 'EcoTab Plus',
    category: 'Electronics',
    recyclabilityIndex: 72,
    basePrice: 35000,
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sustainable tablet for work and entertainment'
  },
  {
    id: 'headphones',
    name: 'EcoSound Pro',
    category: 'Audio',
    recyclabilityIndex: 85,
    basePrice: 12000,
    image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Premium headphones made from recycled materials'
  },
  {
    id: 'smartwatch',
    name: 'GreenWatch Series 5',
    category: 'Wearables',
    recyclabilityIndex: 78,
    basePrice: 28000,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Smart fitness tracker with sustainable design'
  },
  {
    id: 'monitor',
    name: 'EcoDisplay 27"',
    category: 'Electronics',
    recyclabilityIndex: 80,
    basePrice: 25000,
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: '4K monitor with energy-efficient LED technology'
  }
];

export const transportModes: TransportMode[] = [
  {
    id: 'road',
    name: 'Road Transport',
    type: 'road',
    costPerKm: 8,
    setupCost: 5000,
    sustainabilityMultiplier: 0.6,
    maxDistance: 2000,
    icon: '🚛'
  },
  {
    id: 'rail',
    name: 'Rail Transport',
    type: 'rail',
    costPerKm: 4,
    setupCost: 12000,
    sustainabilityMultiplier: 0.9,
    maxDistance: 5000,
    icon: '🚂'
  },
  {
    id: 'air',
    name: 'Air Transport',
    type: 'air',
    costPerKm: 15,
    setupCost: 25000,
    sustainabilityMultiplier: 0.3,
    maxDistance: 10000,
    icon: '✈️'
  }
];