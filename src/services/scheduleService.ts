import { ScheduleEntry } from '../types';
import { COURSE_START_DATE, COURSE_END_DATE, TOTAL_COURSE_HOURS, WEEKLY_FOCUS } from '../constants';
// FIX: The root 'date-fns' package in this environment doesn't seem to export 'parseISO' correctly. Importing from the submodule instead.
import { differenceInDays, addDays, format, max } from 'date-fns';
import parseISO from 'date-fns/parseISO';

const toYYYYMMDD = (date: Date): string => format(date, 'yyyy-MM-dd');

export const generateSchedule = (existingSchedule: ScheduleEntry[], completedMinutesSoFar: number): ScheduleEntry[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const actualStartDate = max([COURSE_START_DATE, today]);
    
    // If schedule already exists and seems up to date, don't regenerate
    if (existingSchedule.length > 0) {
        const lastScheduledDate = parseISO(existingSchedule[existingSchedule.length - 1].date);
        if (lastScheduledDate >= COURSE_END_DATE) {
            // Recalculate missed minutes and redistribute
            return redistributeMissedMinutes(existingSchedule);
        }
    }
    
    const totalMinutesToSchedule = (TOTAL_COURSE_HOURS * 60) - completedMinutesSoFar;
    const remainingDaysCount = differenceInDays(COURSE_END_DATE, actualStartDate) + 1;
    
    if (remainingDaysCount <= 0) return existingSchedule;
    
    const scheduleMap = new Map<string, { plannedMinutes: number; topic: string }>();

    let totalPlannedMinutes = 0;

    // Distribute weekly focus hours
    for (const week of WEEKLY_FOCUS) {
        const weekStartDate = new Date(week.startDate + 'T00:00:00');
        const weekEndDate = addDays(weekStartDate, 6);

        const studyDaysInWeek: Date[] = [];
        for (let d = new Date(weekStartDate); d <= weekEndDate && d <= COURSE_END_DATE; d = addDays(d, 1)) {
            if (d >= actualStartDate) {
                studyDaysInWeek.push(d);
            }
        }
        
        if (studyDaysInWeek.length > 0) {
            const minutesPerDay = Math.floor((week.hours * 60) / studyDaysInWeek.length);
            let remainder = (week.hours * 60) % studyDaysInWeek.length;
            
            for (const day of studyDaysInWeek) {
                const dateStr = toYYYYMMDD(day);
                let dailyMinutes = minutesPerDay;
                if (remainder > 0) {
                    dailyMinutes++;
                    remainder--;
                }
                scheduleMap.set(dateStr, { plannedMinutes: dailyMinutes, topic: week.topics });
                totalPlannedMinutes += dailyMinutes;
            }
        }
    }

    // Distribute any remaining minutes if totals don't match
    const minuteDiscrepancy = totalMinutesToSchedule - totalPlannedMinutes;
    if (minuteDiscrepancy !== 0 && scheduleMap.size > 0) {
        const adjustmentPerDay = minuteDiscrepancy / scheduleMap.size;
        for (const [, data] of scheduleMap.entries()) {
            data.plannedMinutes += adjustmentPerDay;
        }
    }

    const newSchedule: ScheduleEntry[] = [];
    for (let d = new Date(COURSE_START_DATE); d <= COURSE_END_DATE; d = addDays(d, 1)) {
        const dateStr = toYYYYMMDD(d);
        const existingEntry = existingSchedule.find(e => e.date === dateStr);
        if (existingEntry) {
            newSchedule.push(existingEntry);
            continue;
        }

        const plannedData = scheduleMap.get(dateStr);
        newSchedule.push({
            date: dateStr,
            topic: plannedData?.topic ?? 'Review',
            plannedMinutes: Math.round(plannedData?.plannedMinutes ?? 0),
            completedMinutes: 0,
        });
    }

    return redistributeMissedMinutes(newSchedule);
};

const redistributeMissedMinutes = (schedule: ScheduleEntry[]): ScheduleEntry[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toYYYYMMDD(today);
    
    let totalMissedMinutes = 0;
    const futureDaysIndices: number[] = [];

    schedule.forEach((day, index) => {
        const dayDate = parseISO(day.date);
        if (dayDate < today) {
            const deficit = day.plannedMinutes - day.completedMinutes;
            if (deficit > 0) {
                totalMissedMinutes += deficit;
                // Forgive the debt on past days visually
                day.plannedMinutes = day.completedMinutes; 
            }
        } else if (day.date >= todayStr) {
            futureDaysIndices.push(index);
        }
    });

    if (totalMissedMinutes > 0 && futureDaysIndices.length > 0) {
        const minutesToAddPerDay = Math.floor(totalMissedMinutes / futureDaysIndices.length);
        let remainder = totalMissedMinutes % futureDaysIndices.length;

        futureDaysIndices.forEach(index => {
            schedule[index].plannedMinutes += minutesToAddPerDay;
            if (remainder > 0) {
                schedule[index].plannedMinutes++;
                remainder--;
            }
        });
    }

    return schedule;
};
