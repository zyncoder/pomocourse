import { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroPhase, Settings } from '../types';
import { requestNotificationPermission, sendNotification } from '../services/notificationService';

// Valid, short WAV files encoded as base64 data URIs to ensure browser compatibility.
const tickSound = new Audio("data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAESsAABKwAQACABgAZGF0YQIAAAD//wIA/v8EAA==");
const endSound = new Audio("data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoAAAAIAAcABwAIAAgACQA=");

export const usePomodoro = (settings: Settings, onSessionComplete: (minutes: number) => void) => {
  const [phase, setPhase] = useState<PomodoroPhase>(PomodoroPhase.Work);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.workMin * 60);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const phaseDurations = {
    [PomodoroPhase.Work]: settings.workMin * 60,
    [PomodoroPhase.ShortBreak]: settings.shortBreakMin * 60,
    [PomodoroPhase.LongBreak]: settings.longBreakMin * 60,
  };

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startNextPhase = useCallback(() => {
    stopTimer();
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
    setIsActive(true);
    sendNotification(`${nextPhase} has started!`, `Time for your ${nextPhase.toLowerCase()}.`);
    endSound.play().catch(e => console.error("Error playing sound:", e));

    if (completedWorkSession) {
      onSessionComplete(settings.workMin);
    }
  }, [phase, pomodorosCompleted, settings, stopTimer, onSessionComplete, phaseDurations]);
  
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            startNextPhase();
            return 0;
          }
          if (prev % 60 === 0) { // play tick sound every minute for feedback
             tickSound.play().catch(e => console.error("Error playing sound:", e));
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isActive, stopTimer, startNextPhase]);

  useEffect(() => {
    // Update timer if settings change, but only if not active
    if (!isActive) {
        setTimeRemaining(settings.workMin * 60);
        setPhase(PomodoroPhase.Work);
        setPomodorosCompleted(0);
    }
  }, [settings, isActive]);
  
  const start = () => {
    requestNotificationPermission();
    setIsActive(true);
  };
  
  const pause = () => setIsActive(false);

  const reset = () => {
    stopTimer();
    setPhase(PomodoroPhase.Work);
    setTimeRemaining(phaseDurations[PomodoroPhase.Work]);
    setIsActive(false);
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