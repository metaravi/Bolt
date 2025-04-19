const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Placeholder - user needs to provide their own key

export async function getWeatherForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export function formatWeatherData(weatherData) {
  if (!weatherData || !weatherData.list) return [];
  
  return weatherData.list.map(item => ({
    date: new Date(item.dt * 1000),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
  }));
}
