import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PomodoroPhase, Settings } from '../types';
import { requestNotificationPermission, sendNotification } from '../services/notificationService';

// Valid, short WAV files encoded as base64 data URIs to ensure browser compatibility.
const tickSound = new Audio("data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA=");
const endSound = new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBIAAAABAAEARKwAABCxAgAEABAAZGF0YQwwAAAADgAOCA4AAAANAAsADQANAAsACwAJAAkACQAJAAcABwAHAAcABQAFAAUAAwADAAEAAQABAAAAAP//AAEAAQADAAUABwAJAAoADAAOABAAEwAWABkAHQAhACUAJAAdABoAFQARAAwACQAGAAIA//8AAAABAAUACgANABIAFQAZAB0AHwAjACIAHwAcABYAEgANAAkABQABAAAAAQAEAAgADQARABYAGgAcACEAIwAiAB4AGwAVABGADAAIAAMAAAAAAQAFAAoADgARABUAGQAbAB8AIQAgABsAFgAQAAwACAAFAAMAAQAA//8AAQADAAUACAAKAA0ADwARABMAFQAXABkAGwAdAB8AIAAhACIAIwAjACIAIQAgAB4AGwAZABcAFQATABEADwANAAoACAAFAAMA");

export const usePomodoro = (settings: Settings, onSessionComplete: (minutes: number) => void) => {
  const [phase, setPhase] = useState<PomodoroPhase>(PomodoroPhase.Work);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.workMin * 60);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const phaseDurations = useMemo(() => ({
    [PomodoroPhase.Work]: settings.workMin * 60,
    [PomodoroPhase.ShortBreak]: settings.shortBreakMin * 60,
    [PomodoroPhase.LongBreak]: settings.longBreakMin * 60,
  }), [settings.workMin, settings.shortBreakMin, settings.longBreakMin]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
  }, []);

  const startNextPhase = useCallback(() => {
    clearTimerInterval();
    let nextPhase: PomodoroPhase;
    let completedWorkSession = false;

    if (phase === PomodoroPhase.Work) {
      completedWorkSession = true;
      const newCompletedCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompletedCount);
      if (newCompletedCount % settings.longBreakAfter === 0) {
        nextPhase = PomodoroPhase.LongBreak;
      } else {
        nextPhase = PomodoroPhase.ShortBreak;
      }
    } else {
      nextPhase = PomodoroPhase.Work;
    }
    
    setPhase(nextPhase);
    setTimeRemaining(phaseDurations[nextPhase]);
    setIsActive(true); // Ensure timer restarts
    sendNotification(`${nextPhase} has started!`, `Time for your ${nextPhase.toLowerCase()}.`);
    endSound.play().catch(e => console.error("Error playing sound:", e));

    if (completedWorkSession) {
      onSessionComplete(settings.workMin);
    }
  }, [phase, pomodorosCompleted, settings, onSessionComplete, phaseDurations, clearTimerInterval]);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            startNextPhase();
            return 0;
          }
          if (prev > 1 && prev % 60 === 0) {
             tickSound.play().catch(e => console.error("Error playing sound:", e));
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimerInterval;
  }, [isActive, startNextPhase, clearTimerInterval]);

  useEffect(() => {
    // Update timer if settings change, but only if not active
    if (!isActive) {
        setTimeRemaining(phaseDurations[phase]);
    }
  }, [settings, isActive, phase, phaseDurations]);
  
  const start = () => {
    requestNotificationPermission();
    setIsActive(true);
  };
  
  const pause = () => setIsActive(false);

  const reset = () => {
    setIsActive(false);
    setPhase(PomodoroPhase.Work);
    setTimeRemaining(settings.workMin * 60);
    setPomodorosCompleted(0);
  };

  const skip = () => {
    startNextPhase();
  };

  return {
    phase,
    isActive,
    timeRemaining,
    pomodorosInCycle: pomodorosCompleted % settings.longBreakAfter,
    start,
    pause,
    reset,
    skip
  };
};
