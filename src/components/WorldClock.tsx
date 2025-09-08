import React, { useState } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { motion } from 'framer-motion';
import { Plus, X, Globe } from 'lucide-react';
import Button from './ui/Button';

interface WorldClockProps {
  theme: 'light' | 'dark' | 'sunset' | 'ocean';
}

interface ClockCity {
  id: string;
  name: string;
  timezone: string;
}

const popularTimezones: ClockCity[] = [
  { id: '1', name: 'New York', timezone: 'America/New_York' },
  { id: '2', name: 'London', timezone: 'Europe/London' },
  { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: '4', name: 'Sydney', timezone: 'Australia/Sydney' },
  { id: '5', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: '6', name: 'Paris', timezone: 'Europe/Paris' },
  { id: '7', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: '8', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: '9', name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { id: '10', name: 'Berlin', timezone: 'Europe/Berlin' },
];

const WorldClock: React.FC<WorldClockProps> = ({ theme }) => {
  const [selectedCities, setSelectedCities] = useState<ClockCity[]>([
    { id: '1', name: 'New York', timezone: 'America/New_York' },
    { id: '2', name: 'London', timezone: 'Europe/London' },
    { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  ]);
  const [showAddCity, setShowAddCity] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getCardClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800/70 border-gray-700';
      case 'sunset':
        return 'bg-pink-500/30 backdrop-blur-md border-pink-300/30';
      case 'ocean':
        return 'bg-blue-500/30 backdrop-blur-md border-blue-300/30';
      default:
        return 'bg-white/70 backdrop-blur-md border-gray-200';
    }
  };

  const addCity = (city: ClockCity) => {
    if (selectedCities.find(c => c.id === city.id)) return;
    setSelectedCities([...selectedCities, city]);
    setShowAddCity(false);
  };

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(city => city.id !== cityId));
  };

  return (
    <div className="w-full max-w-md">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold flex items-center">
          <Globe className="mr-2" size={24} />
          World Clock
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAddCity(!showAddCity)}
        >
          {showAddCity ? 'Cancel' : 'Add City'}
        </Button>
      </motion.div>

      {showAddCity ? (
        <motion.div 
          className={`rounded-xl border ${getCardClasses()} p-4 mb-6 shadow-lg`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="font-medium mb-3">Select a city to add:</h3>
          <div className="grid grid-cols-2 gap-2">
            {popularTimezones
              .filter(city => !selectedCities.find(c => c.id === city.id))
              .map(city => (
                <button
                  key={city.id}
                  onClick={() => addCity(city)}
                  className="text-left p-2 rounded hover:bg-white/10 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  {city.name}
                </button>
              ))}
          </div>
        </motion.div>
      ) : null}

      <div className="space-y-4">
        {selectedCities.map((city, index) => (
          <motion.div
            key={city.id}
            className={`rounded-xl border ${getCardClasses()} p-4 shadow-lg relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl">{city.name}</h3>
                <p className="text-sm opacity-70">{city.timezone.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold">
                  {formatInTimeZone(currentTime, city.timezone, 'HH:mm')}
                </div>
                <div className="text-sm opacity-70">
                  {formatInTimeZone(currentTime, city.timezone, 'EEEE, MMM d')}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => removeCity(city.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Remove city"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}

        {selectedCities.length === 0 && (
          <div className="text-center py-8 opacity-70">
            No cities added. Click "Add City" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldClock;
