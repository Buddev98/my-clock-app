import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface DigitalClockProps {
  theme: 'light' | 'dark' | 'sunset' | 'ocean';
}

const DigitalClock: React.FC<DigitalClockProps> = ({ theme }) => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
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

  const timeFormat = is24Hour ? 'HH:mm:ss' : 'hh:mm:ss a';
  const dateFormat = 'EEEE, MMMM d, yyyy';

  return (
    <motion.div 
      className={`w-full max-w-md rounded-2xl border ${getCardClasses()} p-6 shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold tracking-tighter mb-2 font-mono">
          {format(time, timeFormat)}
        </div>
        <div className="text-lg opacity-80 mb-4">
          {format(time, dateFormat)}
        </div>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="text-sm px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          {is24Hour ? '12-hour format' : '24-hour format'}
        </button>
      </div>
    </motion.div>
  );
};

export default DigitalClock;
