import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mockEvents = {
  "Bali": [
    {
      id: 1,
      title: "Festival de Galungan",
      date: new Date(Date.now() + 172800000),
      description: "Celebração tradicional balinesa"
    },
    {
      id: 2,
      title: "Noite de Dança Kecak",
      date: new Date(Date.now() + 345600000),
      description: "Apresentação tradicional no templo Uluwatu"
    },
    {
      id: 3,
      title: "Mercado Noturno de Ubud",
      date: new Date(Date.now() + 518400000),
      description: "Comidas e artesanato local"
    }
  ]
};

export default function EventsList({ destination }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simulando chamada API
    setEvents(mockEvents[destination] || []);
  }, [destination]);

  if (!events.length) return null;

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-semibold">{event.title}</h4>
          <p className="text-sm text-gray-600">
            {event.date.toLocaleDateString('pt-BR', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm mt-1">{event.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
