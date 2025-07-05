import { TransportMode, Product, RouteOptimization } from '../types';

export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function calculateSustainabilityScore(
  product: Product,
  transportMode: TransportMode,
  distance: number
): number {
  const baseScore = product.recyclabilityIndex;
  const transportImpact = transportMode.sustainabilityMultiplier * 100;
  const distanceImpact = Math.max(0, 100 - (distance / 50)); // Penalty for longer distances
  
  return Math.round((baseScore + transportImpact + distanceImpact) / 3);
}

export function calculateTransportCost(
  transportMode: TransportMode,
  distance: number,
  quantity: number = 1
): number {
  const transportCost = transportMode.setupCost + (distance * transportMode.costPerKm);
  return Math.round(transportCost * quantity);
}

export function optimizeRoute(
  origin: [number, number],
  destination: [number, number],
  product: Product,
  transportModes: TransportMode[],
  quantity: number = 1
): RouteOptimization[] {
  const distance = calculateDistance(origin, destination);
  
  return transportModes
    .filter(mode => distance <= mode.maxDistance)
    .map(mode => {
      const cost = calculateTransportCost(mode, distance, quantity);
      const sustainabilityScore = calculateSustainabilityScore(product, mode, distance);
      const estimatedTime = calculateEstimatedTime(mode, distance);
      
      return {
        route: `${mode.name} Route`,
        totalCost: cost,
        sustainabilityScore,
        estimatedTime,
        transportMode: mode,
        distance: Math.round(distance)
      };
    })
    .sort((a, b) => {
      // Optimize based on combined cost and sustainability
      const scoreA = (a.sustainabilityScore * 0.6) - (a.totalCost / 1000 * 0.4);
      const scoreB = (b.sustainabilityScore * 0.6) - (b.totalCost / 1000 * 0.4);
      return scoreB - scoreA;
    });
}

function calculateEstimatedTime(mode: TransportMode, distance: number): string {
  const speeds = {
    road: 60, // km/h
    rail: 80,
    air: 500,
    sea: 40
  };
  
  const hours = distance / speeds[mode.type];
  
  if (hours < 24) {
    return `${Math.round(hours)} hours`;
  } else {
    return `${Math.round(hours / 24)} days`;
  }
}

export function calculateEcologicalSavings(
  selectedRoute: RouteOptimization,
  allRoutes: RouteOptimization[]
): string {
  if (allRoutes.length === 0) return "No alternatives available";
  
  const worstRoute = allRoutes.reduce((prev, current) => 
    prev.sustainabilityScore < current.sustainabilityScore ? prev : current
  );
  
  const savings = selectedRoute.sustainabilityScore - worstRoute.sustainabilityScore;
  
  if (savings > 0) {
    const co2Savings = Math.round(savings * 0.5); // Approximate CO2 savings in kg
    return `You saved approximately ${co2Savings}kg of CO2 emissions by choosing this route!`;
  }
  
  return "This is the most sustainable option available.";
}