
import React, { useState, useMemo } from 'react';
import { useSchedule } from './hooks/useSchedule';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import { NavigationIcon } from './components/Icons';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const { 
    schedule, 
    gamification, 
    settings, 
    updateSettings, 
    logPomodoro,
    exportState,
    importState
  } = useSchedule();

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayEntry = useMemo(() => schedule.find(day => day.date === todayISO), [schedule, todayISO]);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard todayEntry={todayEntry} gamification={gamification} settings={settings} logPomodoro={logPomodoro} />;
      case View.Calendar:
        return <CalendarView schedule={schedule} />;
      case View.Stats:
        return <StatsView schedule={schedule} gamification={gamification} />;
      case View.Settings:
        return <SettingsView settings={settings} onUpdateSettings={updateSettings} onExport={exportState} onImport={importState} />;
      default:
        return <Dashboard todayEntry={todayEntry} gamification={gamification} settings={settings} logPomodoro={logPomodoro} />;
    }
  };

  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: 'dashboard' },
    { view: View.Calendar, label: 'Calendar', icon: 'calendar' },
    { view: View.Stats, label: 'Stats', icon: 'stats' },
    { view: View.Settings, label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
      <nav className="md:w-64 bg-gray-900/30 backdrop-blur-sm border-b md:border-b-0 md:border-r border-gray-700 p-4 shrink-0">
        <div className="flex items-center space-x-3 mb-8">
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
          </svg>
          <h1 className="text-xl font-bold tracking-tighter">PomoCourse</h1>
        </div>
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.view}>
              <button
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  currentView === item.view ? 'bg-red-600 text-white' : 'hover:bg-gray-800'
                }`}
              >
                <NavigationIcon icon={item.icon} />
                <span className="font-semibold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
