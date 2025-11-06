
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppState, ScheduleEntry, Settings, Gamification, Badge } from '../types';
import { generateSchedule } from '../services/scheduleService';
import { DEFAULT_SETTINGS, POINTS_PER_POMODORO, DAILY_TARGET_BONUS, INITIAL_BADGES, POINTS_PER_LEVEL } from '../constants';
import { format } from 'date-fns';

const toYYYYMMDD = (date: Date): string => format(date, 'yyyy-MM-dd');

const initialAppState: AppState = {
  profile: { name: 'User', createdAt: new Date().toISOString() },
  settings: DEFAULT_SETTINGS,
  schedule: [],
  gamification: {
    points: 0,
    level: 1,
    streakCurrent: 0,
    streakMax: 0,
    badges: INITIAL_BADGES,
  },
  activityLog: [],
};

export const useSchedule = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('pomoCourseState', initialAppState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const completedMinutesSoFar = appState.schedule.reduce((acc, day) => acc + day.completedMinutes, 0);
      const newSchedule = generateSchedule(appState.schedule, completedMinutesSoFar);
      
      setAppState(prev => ({ ...prev, schedule: newSchedule }));
      setIsInitialized(true);
    }
  }, [isInitialized, appState.schedule, setAppState]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, [setAppState]);

  const logPomodoro = useCallback((minutes: number) => {
    const todayStr = toYYYYMMDD(new Date());
    let pointsEarned = POINTS_PER_POMODORO;
    let newBadges: Badge[] = [];
    
    setAppState(prev => {
        const newSchedule = prev.schedule.map(day => {
            if (day.date === todayStr) {
                return { ...day, completedMinutes: day.completedMinutes + minutes };
            }
            return day;
        });

        const todayEntry = newSchedule.find(d => d.date === todayStr);
        let streak = prev.gamification.streakCurrent;
        
        // Check for daily goal completion and streak
        if (todayEntry && (todayEntry.completedMinutes - minutes < todayEntry.plannedMinutes) && (todayEntry.completedMinutes >= todayEntry.plannedMinutes)) {
            pointsEarned += DAILY_TARGET_BONUS;
            streak++; // This logic for streak is basic. A more robust one would check previous days.
        }

        const newPoints = prev.gamification.points + pointsEarned;
        const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1;

        // Check for badges
        newBadges = prev.gamification.badges.map(b => {
            if (!b.achievedOn) {
                if (b.id === 'streak3' && streak >= 3) b.achievedOn = todayStr;
                if (b.id === 'streak7' && streak >= 7) b.achievedOn = todayStr;
                if (b.id === 'streak14' && streak >= 14) b.achievedOn = todayStr;
            }
            return b;
        });

        const newGamification: Gamification = {
            ...prev.gamification,
            points: newPoints,
            level: newLevel,
            streakCurrent: streak,
            streakMax: Math.max(prev.gamification.streakMax, streak),
            badges: newBadges
        };

        return {
            ...prev,
            schedule: newSchedule,
            gamification: newGamification,
        };
    });
  }, [setAppState]);
  
  const exportState = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(appState, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `pomo-course-backup-${new Date().toISOString()}.json`;
    link.click();
  }, [appState]);

  const importState = useCallback((jsonString: string) => {
    try {
      const newState = JSON.parse(jsonString);
      // Basic validation
      if (newState.profile && newState.settings && newState.schedule && newState.gamification) {
        setAppState(newState);
        alert('State imported successfully!');
      } else {
        alert('Invalid import file format.');
      }
    } catch (error) {
      console.error('Failed to import state:', error);
      alert('Failed to parse import file. Is it a valid JSON?');
    }
  }, [setAppState]);

  return { ...appState, updateSettings, logPomodoro, exportState, importState };
};
