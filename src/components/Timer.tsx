import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import Button from './ui/Button';

interface TimerProps {
  theme: 'light' | 'dark' | 'sunset' | 'ocean';
}

const Timer: React.FC<TimerProps> = ({ theme }) => {
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsComplete(true);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isComplete) {
      setIsComplete(false);
      setTimeLeft(duration);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value, 10) * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
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

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className="w-full max-w-md">
      <motion.div 
        className={`rounded-xl border ${getCardClasses()} p-6 shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <div className="relative mb-8">
            <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeOpacity="0.2"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                transform="rotate(-90 50 50)"
                initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progressPercentage / 100)}` }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              {isEditing ? (
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={duration / 60}
                    onChange={handleDurationChange}
                    className="w-16 text-center bg-transparent border-b border-current text-3xl font-bold"
                    autoFocus
                  />
                  <span className="text-sm mt-1">minutes</span>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="mt-2 text-sm underline"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div 
                  className="text-5xl font-mono font-bold cursor-pointer"
                  onClick={() => !isRunning && setIsEditing(true)}
                >
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
          
          {isComplete && (
            <motion.div 
              className="mb-4 flex items-center justify-center text-lg font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Bell className="mr-2" />
              Time's up!
            </motion.div>
          )}
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleStartStop}
              variant="primary"
              className="flex items-center"
            >
              {isRunning ? <Pause className="mr-1" size={18} /> : <Play className="mr-1" size={18} />}
              {isRunning ? 'Pause' : isComplete ? 'Restart' : 'Start'}
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
          
          {!isEditing && !isRunning && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-4 text-sm underline opacity-70 hover:opacity-100"
            >
              Edit timer
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Timer;
