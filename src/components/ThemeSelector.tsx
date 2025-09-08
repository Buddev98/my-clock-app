import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunset, Waves } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'sunset' | 'ocean';
  onThemeChange: (theme: 'light' | 'dark' | 'sunset' | 'ocean') => void;
}

interface ThemeOption {
  id: 'light' | 'dark' | 'sunset' | 'ocean';
  name: string;
  icon: React.ReactNode;
  description: string;
  bgClass: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const themes: ThemeOption[] = [
    {
      id: 'light',
      name: 'Light',
      icon: <Sun size={24} />,
      description: 'Clean, bright interface',
      bgClass: 'bg-gradient-to-br from-blue-50 to-white'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: <Moon size={24} />,
      description: 'Easy on the eyes',
      bgClass: 'bg-gray-900'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      icon: <Sunset size={24} />,
      description: 'Warm, vibrant colors',
      bgClass: 'bg-gradient-to-br from-orange-400 to-pink-600'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      icon: <Waves size={24} />,
      description: 'Cool, calming blues',
      bgClass: 'bg-gradient-to-br from-blue-400 to-teal-500'
    }
  ];

  return (
    <div className="w-full max-w-md">
      <motion.h2 
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Choose a Theme
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            className={`rounded-xl border border-white/20 p-4 cursor-pointer transition-all ${
              currentTheme === theme.id ? 'ring-2 ring-white' : ''
            }`}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => onThemeChange(theme.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${theme.bgClass} text-current`}>
                {theme.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{theme.name}</h3>
                <p className="text-sm opacity-70">{theme.description}</p>
              </div>
              {currentTheme === theme.id && (
                <div className="ml-auto">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-8 p-4 rounded-lg bg-white/10 border border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-medium mb-2">About Themes</h3>
        <p className="text-sm opacity-80">
          Themes change the look and feel of your clock app. Choose a theme that matches your mood or environment.
          All themes are designed to be easy to read and visually appealing.
        </p>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;
