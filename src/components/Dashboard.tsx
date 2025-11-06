import React from 'react';
import { ScheduleEntry, Gamification, Settings } from '../types';
import Timer from './Timer';
import { ProgressIcon, StreakIcon, PointsIcon } from './Icons';

interface DashboardProps {
  todayEntry: ScheduleEntry | undefined;
  gamification: Gamification;
  settings: Settings;
  logPomodoro: (minutes: number) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ todayEntry, gamification, settings, logPomodoro }) => {
    const plannedPomodoros = todayEntry ? Math.floor(todayEntry.plannedMinutes / settings.workMin) : 0;
    const completedPomodoros = todayEntry ? Math.floor(todayEntry.completedMinutes / settings.workMin) : 0;
    const progressPercent = todayEntry && todayEntry.plannedMinutes > 0 ? Math.round((todayEntry.completedMinutes / todayEntry.plannedMinutes) * 100) : 0;

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <Timer settings={settings} onSessionComplete={logPomodoro} />
            </div>
            <div className="space-y-4">
                 <StatCard icon={<ProgressIcon />} title="Today's Progress" value={`${progressPercent}%`} color="bg-blue-500/20" />
                 <StatCard icon={<PointsIcon />} title="Total Points" value={gamification.points} color="bg-yellow-500/20" />
                 <StatCard icon={<StreakIcon />} title="Current Streak" value={`${gamification.streakCurrent} days`} color="bg-red-500/20" />
            </div>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Today's Plan</h2>
            {todayEntry ? (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-lg">{todayEntry.topic}</p>
                        <p className="text-gray-400">{completedPomodoros} / {plannedPomodoros} Pomodoros</p>
                    </div>
                     <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-right mt-1 text-sm text-gray-400">{todayEntry.completedMinutes} of {todayEntry.plannedMinutes} min complete</p>
                </div>
            ) : (
                <p>No study session planned for today. Enjoy your day off!</p>
            )}
        </div>
    </div>
  );
};

export default Dashboard;