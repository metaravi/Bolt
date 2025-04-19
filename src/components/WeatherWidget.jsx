import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mockWeatherData = {
  "Bali": [
    { date: new Date(), temp: 28, description: "Ensolarado", icon: "☀️" },
    { date: new Date(Date.now() + 86400000), temp: 27, description: "Parcialmente nublado", icon: "⛅" },
    { date: new Date(Date.now() + 172800000), temp: 29, description: "Ensolarado", icon: "☀️" },
    { date: new Date(Date.now() + 259200000), temp: 26, description: "Chuva leve", icon: "🌧️" },
    { date: new Date(Date.now() + 345600000), temp: 28, description: "Ensolarado", icon: "☀️" }
  ]
};

export default function WeatherWidget({ destination }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // Simulando chamada API
    setForecast(mockWeatherData[destination] || []);
  }, [destination]);

  if (!forecast.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 text-center p-4 bg-gray-50 rounded-lg min-w-[100px]"
          >
            <p className="text-sm text-gray-600">
              {day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
            </p>
            <p className="text-2xl my-2">{day.icon}</p>
            <p className="font-semibold">{day.temp}°C</p>
            <p className="text-sm text-gray-600">{day.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
