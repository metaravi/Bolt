import React from 'react';
import { motion } from 'framer-motion';

const transportOptions = [
  {
    id: 1,
    name: "Uber",
    icon: "🚗",
    description: "Transporte particular sob demanda"
  },
  {
    id: 2,
    name: "Transporte Público",
    icon: "🚌",
    description: "Ônibus e metrô locais"
  },
  {
    id: 3,
    name: "Aluguel de Carro",
    icon: "🚙",
    description: "Liberdade para explorar"
  },
  {
    id: 4,
    name: "Bicicleta",
    icon: "🚲",
    description: "Opção ecológica e saudável"
  }
];

export default function TransportOptions({ destination }) {
  return (
    <div className="space-y-4">
      {transportOptions.map((option, index) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-gray-50 rounded-lg flex items-center gap-4"
        >
          <span className="text-2xl">{option.icon}</span>
          <div>
            <h4 className="font-semibold">{option.name}</h4>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
          <button
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              // Aqui você pode adicionar a lógica para abrir o app correspondente
              console.log(`Abrir ${option.name} para ${destination}`);
            }}
          >
            Reservar
          </button>
        </motion.div>
      ))}
    </div>
  );
}
