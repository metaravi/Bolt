import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'name', title: 'Your Name' },
  { id: 'type', title: 'Traveler Type' },
  { id: 'preferences', title: 'Travel Preferences' },
  { id: 'climate', title: 'Climate' },
  { id: 'budget', title: 'Budget' }
];

const TravelQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    travelerType: "Adventure Seeker",
    preferences: {
      walking: "moderate",
      queues: "moderate",
      localExperience: "high"
    },
    climate: "Tropical",
    budget: "Budget-friendly"
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-lg font-medium text-gray-700">What's your name?</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </label>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-lg font-medium text-gray-700">What type of traveler are you?</span>
              <select
                name="travelerType"
                value={formData.travelerType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option>Adventure Seeker</option>
                <option>Culture Explorer</option>
                <option>Relaxation Seeker</option>
              </select>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {formData.name ? `${formData.name}, Let's Find Your Perfect Destination` : 'Find Your Perfect Destination'}
        </h2>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-24 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {currentStep === steps.length - 1 ? 'Get Recommendations' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelQuiz;
