import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import Button from './ui/Button';

interface StopwatchProps {
  theme: 'light' | 'dark' | 'sunset' | 'ocean';
}

interface Lap {
  id: number;
  time: number;
  diff: number;
}

const Stopwatch: React.FC<StopwatchProps> = ({ theme }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (!isRunning) return;
    
    const lapTime = time;
    const lapDiff = lapTime - lastLapTimeRef.current;
    
    setLaps(prevLaps => [
      { id: prevLaps.length + 1, time: lapTime, diff: lapDiff },
      ...prevLaps
    ]);
    
    lastLapTimeRef.current = lapTime;
  };

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

  return (
    <div className="w-full max-w-md">
      <motion.div 
        className={`rounded-xl border ${getCardClasses()} p-6 shadow-lg mb-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <div className="text-5xl font-mono font-bold mb-6 tracking-wider">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleStartStop}
              variant="primary"
              className="flex items-center"
            >
              {isRunning ? <Pause className="mr-1" size={18} /> : <Play className="mr-1" size={18} />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            
            <Button 
              onClick={handleLap} 
              disabled={!isRunning}
              variant="outline"
              className="flex items-center"
            >
              <Flag className="mr-1" size={18} />
              Lap
            </Button>
            
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex items-center"
            >
              <RotateCcw className="mr-1" size={18} />
              Reset
            </Button>
          </div>
        </div>
      </motion.div>
      
      {laps.length > 0 && (
        <motion.div 
          className={`rounded-xl border ${getCardClasses()} p-4 shadow-lg`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h3 className="font-medium mb-2">Laps</h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm opacity-70">
                  <th className="pb-2 pl-2">Lap</th>
                  <th className="pb-2">Lap Time</th>
                  <th className="pb-2">Total Time</th>
                </tr>
              </thead>
              <tbody>
                {laps.map(lap => (
                  <motion.tr 
                    key={lap.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-current/10"
                  >
                    <td className="py-2 pl-2">{lap.id}</td>
                    <td className="py-2 font-mono">{formatTime(lap.diff)}</td>
                    <td className="py-2 font-mono">{formatTime(lap.time)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Stopwatch;
