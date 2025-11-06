import React from 'react';
import { ScheduleEntry } from '../types';
// FIX: The root 'date-fns' package in this environment doesn't export 'startOfMonth' or 'startOfWeek'. Importing from submodules.
import { format, endOfMonth, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';

interface CalendarViewProps {
  schedule: ScheduleEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ schedule }) => {
    // For this demo, we'll just show the current month. A real app would have month navigation.
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(lastDayOfMonth),
  });

  const scheduleMap = new Map(schedule.map(entry => [entry.date, entry]));
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500/30 border-green-500';
    if (progress > 50) return 'bg-yellow-500/30 border-yellow-500';
    if (progress > 0) return 'bg-blue-500/30 border-blue-500';
    return 'bg-gray-800/50 border-gray-700';
  }

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6">Schedule Calendar</h2>
        <div className="bg-gray-800/50 p-4 rounded-2xl">
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {weekDays.map(day => <div key={day} className="font-bold text-gray-400">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const entry = scheduleMap.get(dateStr);
                const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
                const progress = entry && entry.plannedMinutes > 0 ? (entry.completedMinutes / entry.plannedMinutes) * 100 : 0;
                
                return (
                <div 
                    key={day.toString()} 
                    className={`h-28 rounded-lg p-2 border ${
                        isCurrentMonth ? 'opacity-100' : 'opacity-40'
                    } ${
                        isToday(day) ? 'border-red-500 border-2' : getDayColor(progress)
                    }`}
                >
                    <span className="font-bold">{format(day, 'd')}</span>
                    {entry && entry.plannedMinutes > 0 && (
                        <div className="text-xs mt-2 text-left">
                            <p className="font-semibold truncate">{entry.topic}</p>
                            <p>{entry.plannedMinutes} min</p>
                        </div>
                    )}
                </div>
                );
            })}
            </div>
        </div>
    </div>
  );
};

export default CalendarView;
