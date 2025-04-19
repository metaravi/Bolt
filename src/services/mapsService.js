const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Placeholder - user needs to provide their own key

export async function getPlaceDetails(location) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(location)}&key=${API_KEY}`
    );
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

export function getDirectionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getStaticMapUrl(latitude, longitude, zoom = 13) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x300&key=${API_KEY}`;
}
