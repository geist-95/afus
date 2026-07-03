export const MOROCCAN_CITIES = [
  { name: 'Marrakech', lat: 31.6295, lng: -8.0366 },
  { name: 'Fès', lat: 34.0331, lng: -5.0003 },
  { name: 'Meknès', lat: 33.8935, lng: -5.5473 },
  { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { name: 'Tétouan', lat: 35.5785, lng: -5.3684 },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Tangier', lat: 35.7595, lng: -5.8340 },
  { name: 'Agadir', lat: 30.4202, lng: -9.5982 },
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Function to find closest city, optionally filtered by valid city names
export function findClosestCityWithProducts(lat: number, lng: number, validCityNames: Set<string>): string {
  let closestCity = "Marrakech"; // default
  let minDistance = Infinity;

  for (const city of MOROCCAN_CITIES) {
    if (!validCityNames.has(city.name)) continue;
    const dist = getDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }

  // Fallback to absolute closest if somehow no valid cities
  if (minDistance === Infinity) {
    for (const city of MOROCCAN_CITIES) {
      const dist = getDistance(lat, lng, city.lat, city.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city.name;
      }
    }
  }

  return closestCity;
}
