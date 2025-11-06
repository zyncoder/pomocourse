export interface Settings {
  workMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  longBreakAfter: number;
}

export interface ScheduleEntry {
  date: string; // YYYY-MM-DD
  topic: string;
  plannedMinutes: number;
  completedMinutes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  achievedOn?: string; // YYYY-MM-DD
}

export interface Gamification {
  points: number;
  level: number;
  streakCurrent: number;
  streakMax: number;
  badges: Badge[];
}

export interface ActivityLogEntry {
  timestamp: number;
  type: 'POMO_COMPLETE' | 'STREAK_EXTEND' | 'LEVEL_UP';
  details: string;
}

export interface AppState {
  profile: {
    name: string;
    createdAt: string;
  };
  settings: Settings;
  schedule: ScheduleEntry[];
  gamification: Gamification;
  activityLog: ActivityLogEntry[];
}

export enum PomodoroPhase {
  Work = 'Work',
  ShortBreak = 'Short Break',
  LongBreak = 'Long Break'
}

export enum View {
    Dashboard = 'Dashboard',
    Calendar = 'Calendar',
    Stats = 'Stats',
    Settings = 'Settings'
}
