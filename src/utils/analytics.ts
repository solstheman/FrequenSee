import { differenceInDays } from 'date-fns';
import type { LogEntry, Tracker } from '../store/TrackerStore';

export interface AnalyticsStats {
    dailyAvg: number;
    monthlyAvg: number;
    avgIntervalDays: number;
    lastSeen: number;
}

export const getFrequencyLabel = (avgIntervalDays: number): string => {
    if (avgIntervalDays === 0) return 'no logs yet';
    if (avgIntervalDays < 1.5) return 'daily';
    if (avgIntervalDays < 10) return 'weekly';
    if (avgIntervalDays < 21) return 'every other week';
    if (avgIntervalDays < 45) return 'monthly';
    if (avgIntervalDays < 100) return 'every other month';
    if (avgIntervalDays < 250) return 'every 5 months';
    return 'every year';
};

export const calculateStats = (tracker: Tracker, logs: LogEntry[]): AnalyticsStats | null => {
    if (logs.length < 2) return null;

    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
    const totalDays = Math.max(1, differenceInDays(Date.now(), tracker.createdAt));

    // Frequency calculation
    const dailyAvg = logs.length / totalDays;
    const monthlyAvg = dailyAvg * 30.44;

    // Average interval
    let totalInterval = 0;
    for (let i = 0; i < sortedLogs.length - 1; i++) {
        totalInterval += (sortedLogs[i].timestamp - sortedLogs[i + 1].timestamp);
    }
    const avgIntervalMs = totalInterval / (logs.length - 1);
    const avgIntervalDays = avgIntervalMs / (1000 * 60 * 60 * 24);

    return {
        dailyAvg,
        monthlyAvg,
        avgIntervalDays,
        lastSeen: sortedLogs[0].timestamp
    };
};
