const API_KEY = 'YOUR_PREDICTHQ_API_KEY'; // Placeholder - user needs to provide their own key

export async function getLocalEvents(city, startDate, endDate) {
  try {
    const response = await fetch(
      `https://api.predicthq.com/v1/events/?location=${city}&active.gte=${startDate}&active.lte=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export function formatEventData(events) {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    category: event.category,
    startDate: new Date(event.start),
    endDate: new Date(event.end),
    location: event.location,
    description: event.description
  }));
}
