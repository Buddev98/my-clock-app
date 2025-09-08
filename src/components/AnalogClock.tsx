import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalogClockProps {
  theme: 'light' | 'dark' | 'sunset' | 'ocean';
}

const AnalogClock: React.FC<AnalogClockProps> = ({ theme }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  // Calculate rotation angles
  const secondsAngle = (seconds / 60) * 360;
  const minutesAngle = ((minutes + seconds / 60) / 60) * 360;
  const hoursAngle = ((hours + minutes / 60) / 12) * 360;

  const getClockFaceClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 shadow-lg shadow-gray-950/30';
      case 'sunset':
        return 'bg-gradient-to-br from-orange-300 to-pink-400 border-pink-300 shadow-lg shadow-pink-500/30';
      case 'ocean':
        return 'bg-gradient-to-br from-blue-300 to-teal-400 border-teal-300 shadow-lg shadow-blue-500/30';
      default:
        return 'bg-white border-gray-200 shadow-lg shadow-blue-100/50';
    }
  };

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 flex items-center justify-center transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer select-none"
      style={{ 
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.5)'
      }}
      className={getClockFaceClasses()}>
      
      {/* Clock markings */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 bg-current"
          style={{
            height: i % 3 === 0 ? '12px' : '6px',
            transform: `rotate(${i * 30}deg) translateY(-50%)`,
            top: '50%',
            left: 'calc(50% - 0.5px)',
            transformOrigin: '50% 0',
          }}
        />
      ))}

      {/* Hour hand */}
      <motion.div
        className="absolute w-1.5 rounded-full bg-current origin-bottom"
        style={{
          height: '25%',
          bottom: '50%',
          left: 'calc(50% - 0.75px)',
          transformOrigin: 'bottom',
        }}
        animate={{ rotate: hoursAngle }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      />

      {/* Minute hand */}
      <motion.div
        className="absolute w-1 rounded-full bg-current origin-bottom"
        style={{
          height: '35%',
          bottom: '50%',
          left: 'calc(50% - 0.5px)',
          transformOrigin: 'bottom',
        }}
        animate={{ rotate: minutesAngle }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      />

      {/* Second hand */}
      <motion.div
        className="absolute w-0.5 rounded-full bg-red-500 origin-bottom"
        style={{
          height: '40%',
          bottom: '50%',
          left: 'calc(50% - 0.25px)',
          transformOrigin: 'bottom',
        }}
        animate={{ rotate: secondsAngle }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      />

      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-red-500 rounded-full" />
    </div>
  );
};

export default AnalogClock;
