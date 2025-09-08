import React, { useState } from 'react';
import { Tabs } from './components/ui/Tabs';
import AnalogClock from './components/AnalogClock';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import { Clock, Globe, Timer as TimerIcon, StopwatchIcon, Palette } from 'lucide-react';
import ThemeSelector from './components/ThemeSelector';

function App() {
  const [activeTab, setActiveTab] = useState('clock');
  const [theme, setTheme] = useState<'light' | 'dark' | 'sunset' | 'ocean'>('light');

  const tabs = [
    { id: 'clock', label: 'Clock', icon: <Clock size={20} /> },
    { id: 'world', label: 'World', icon: <Globe size={20} /> },
    { id: 'stopwatch', label: 'Stopwatch', icon: <StopwatchIcon size={20} /> },
    { id: 'timer', label: 'Timer', icon: <TimerIcon size={20} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={20} /> },
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'sunset':
        return 'bg-gradient-to-br from-orange-400 to-pink-600 text-white';
      case 'ocean':
        return 'bg-gradient-to-br from-blue-400 to-teal-500 text-white';
      default:
        return 'bg-gradient-to-br from-blue-50 to-white text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${getThemeClasses()}`}>
      <header className="py-6 px-4 text-center">
        <h1 className="text-3xl font-bold">Elegant Clock</h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center">
        {activeTab === 'clock' && (
          <div className="flex flex-col items-center space-y-8 w-full max-w-md">
            <AnalogClock theme={theme} />
            <DigitalClock theme={theme} />
          </div>
        )}
        
        {activeTab === 'world' && <WorldClock theme={theme} />}
        {activeTab === 'stopwatch' && <Stopwatch theme={theme} />}
        {activeTab === 'timer' && <Timer theme={theme} />}
        {activeTab === 'theme' && <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />}
      </main>

      <footer className="mt-auto">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </footer>
    </div>
  );
}

export default App;
