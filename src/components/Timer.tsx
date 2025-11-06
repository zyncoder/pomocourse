import React from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { Settings } from '../types';
import { PlayIcon, PauseIcon, ResetIcon, SkipIcon } from './Icons';

interface TimerProps {
  settings: Settings;
  onSessionComplete: (minutes: number) => void;
}

const Timer: React.FC<TimerProps> = ({ settings, onSessionComplete }) => {
  const { phase, isActive, timeRemaining, pomodorosInCycle, start, pause, reset, skip } = usePomodoro(settings, onSessionComplete);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const totalDuration = 
    phase === 'Work' ? settings.workMin * 60 : 
    phase === 'Short Break' ? settings.shortBreakMin * 60 : 
    settings.longBreakMin * 60;
    
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  const phaseColor = 
    phase === 'Work' ? 'text-red-400' : 
    phase === 'Short Break' ? 'text-green-400' : 
    'text-blue-400';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-700"/>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="339.292"
            strokeDashoffset={339.292 - (progress / 100) * 339.292}
            className={`transition-all duration-1000 ${phaseColor.replace('text-', 'stroke-')}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="z-10">
          <p className={`text-6xl font-black tabular-nums`}>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
          <p className={`text-xl font-bold uppercase tracking-widest ${phaseColor}`}>{phase}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mt-8">
        <button onClick={reset} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" aria-label="Reset Timer">
          <ResetIcon />
        </button>

        {!isActive ? (
          <button onClick={start} className="p-5 bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg" aria-label="Start Timer">
            <PlayIcon />
          </button>
        ) : (
          <button onClick={pause} className="p-5 bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg" aria-label="Pause Timer">
            <PauseIcon />
          </button>
        )}
        
        <button onClick={skip} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" aria-label="Skip Phase">
            <SkipIcon />
        </button>
      </div>
      <div className="flex space-x-2 mt-6">
        {[...Array(settings.longBreakAfter)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < pomodorosInCycle ? 'bg-red-500' : 'bg-gray-600'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default Timer;
