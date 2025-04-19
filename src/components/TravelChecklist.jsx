import React, { useState } from 'react';
import { motion } from 'framer-motion';

const defaultItems = [
  { id: 1, name: "Passaporte", category: "Documentos", essential: true },
  { id: 2, name: "Seguro Viagem", category: "Documentos", essential: true },
  { id: 3, name: "Roupas", category: "Vestuário", essential: true },
  { id: 4, name: "Carregador", category: "Eletrônicos", essential: true },
  { id: 5, name: "Adaptador", category: "Eletrônicos", essential: false },
  { id: 6, name: "Protetor Solar", category: "Higiene", essential: true }
];

export default function TravelChecklist() {
  const [items, setItems] = useState(defaultItems);
  const [newItem, setNewItem] = useState("");

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItem.trim(),
        category: "Personalizado",
        essential: false
      }
    ]);
    setNewItem("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Adicionar item..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Adicionar
        </button>
      </form>

      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5"
            />
            <span className={item.checked ? 'line-through text-gray-500' : ''}>
              {item.name}
            </span>
            {item.essential && (
              <span className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Essencial
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
