import React from 'react';
import { ScheduleEntry, Gamification } from '../types';
import { TOTAL_COURSE_HOURS, POINTS_PER_LEVEL } from '../constants';
import { BadgeIcon } from './Icons';

interface StatsViewProps {
  schedule: ScheduleEntry[];
  gamification: Gamification;
}

const StatsView: React.FC<StatsViewProps> = ({ schedule, gamification }) => {
  const totalCompletedMinutes = schedule.reduce((sum, day) => sum + day.completedMinutes, 0);
  const totalCourseMinutes = TOTAL_COURSE_HOURS * 60;
  const courseCompletionPercent = totalCourseMinutes > 0 ? Math.round((totalCompletedMinutes / totalCourseMinutes) * 100) : 0;
  
  const levelProgress = ((gamification.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem title="Course Completion" value={`${courseCompletionPercent}%`} />
        <StatItem title="Time Studied" value={`${(totalCompletedMinutes / 60).toFixed(1)} hrs`} />
        <StatItem title="Current Streak" value={`${gamification.streakCurrent} days`} />
        <StatItem title="Max Streak" value={`${gamification.streakMax} days`} />
      </div>

      <div className="bg-gray-800/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Level {gamification.level}</h3>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${levelProgress}%` }}></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-400">
            <span>{gamification.points % POINTS_PER_LEVEL} / {POINTS_PER_LEVEL} XP</span>
            <span>Total Points: {gamification.points}</span>
        </div>
      </div>

      <div className="bg-gray-800/50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gamification.badges.map(badge => (
            <div key={badge.id} className={`p-4 rounded-lg flex flex-col items-center text-center ${badge.achievedOn ? 'bg-yellow-500/20' : 'bg-gray-700/50'}`}>
                <div className={`text-4xl mb-2 ${badge.achievedOn ? 'text-yellow-400' : 'text-gray-500'}`}>
                    <BadgeIcon />
                </div>
                <p className="font-semibold text-sm">{badge.name}</p>
                {badge.achievedOn && <p className="text-xs text-gray-400">{badge.achievedOn}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{title: string, value: string | number}> = ({title, value}) => (
    <div className="bg-gray-800/50 p-5 rounded-xl text-center">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-extrabold">{value}</p>
    </div>
);


export default StatsView;