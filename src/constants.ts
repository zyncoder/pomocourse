import { Settings, Badge } from "./types";

export const COURSE_START_DATE = new Date('2025-11-06T00:00:00');
export const COURSE_END_DATE = new Date('2026-01-01T00:00:00');
export const TOTAL_COURSE_HOURS = 64;

export const WEEKLY_FOCUS: { name: string; hours: number; startDate: string, topics: string }[] = [
  { name: 'Nov 6–12',    startDate: '2025-11-06', hours: 6.5,  topics: 'HTML & CSS' },
  { name: 'Nov 13–26',   startDate: '2025-11-13', hours: 22,   topics: 'JavaScript' },
  { name: 'Nov 27–Dec 9',startDate: '2025-11-27', hours: 15.5, topics: 'React' },
  { name: 'Dec 10–13',   startDate: '2025-12-10', hours: 0.9,  topics: 'Tailwind CSS' },
  { name: 'Dec 14–22',   startDate: '2025-12-14', hours: 10,   topics: 'Backend (ChaiAurCode)' },
  { name: 'Dec 23–28',   startDate: '2025-12-23', hours: 6.2,  topics: 'Backend (Auth)' },
  { name: 'Dec 29–31',   startDate: '2025-12-29', hours: 2.25, topics: 'Git & System Design' },
];

export const DEFAULT_SETTINGS: Settings = {
  workMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  longBreakAfter: 4,
};

export const POINTS_PER_POMODORO = 10;
export const DAILY_TARGET_BONUS = 20;
export const WEEKLY_TARGET_BONUS = 50;
export const POINTS_PER_LEVEL = 500;

export const INITIAL_BADGES: Badge[] = [
    { id: 'streak3', name: '3-Day Streak', description: 'Complete your daily goal 3 days in a row.' },
    { id: 'streak7', name: '7-Day Streak', description: 'Complete your daily goal 7 days in a row.' },
    { id: 'streak14', name: '14-Day Streak', description: 'Complete your daily goal 14 days in a row.' },
    { id: 'week1', name: 'Week 1 Complete', description: 'Finish all Pomodoros for the first week.' },
    { id: 'perfectWeek', name: 'Perfect Week', description: 'Complete 100% of a weekly target.' },
    { id: 'courseComplete', name: 'Course Complete!', description: 'Finish all 64 hours of the course.' },
];
