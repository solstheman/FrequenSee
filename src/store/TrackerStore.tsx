import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface Tracker {
    id: string;
    label: string;
    color: string;
    icon: string;
    createdAt: number;
}

export interface LogEntry {
    id: string;
    trackerId: string;
    timestamp: number;
}

interface TrackerContextType {
    trackers: Tracker[];
    logs: LogEntry[];
    loading: boolean;
    addTracker: (label: string, color: string, icon: string) => void;
    logOccurrence: (trackerId: string) => void;
    deleteTracker: (trackerId: string) => void;
    loadDemoData: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider = ({ children }: { children: ReactNode }) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Initialize from LocalStorage
    useEffect(() => {
        const savedTrackers = localStorage.getItem('life-trackers');
        const savedLogs = localStorage.getItem('life-tracker-logs');

        if (savedTrackers) {
            setTrackers(JSON.parse(savedTrackers));
        } else {
            setTrackers([]);
        }

        if (savedLogs) {
            setLogs(JSON.parse(savedLogs));
        }
        setLoading(false);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('life-trackers', JSON.stringify(trackers));
            localStorage.setItem('life-tracker-logs', JSON.stringify(logs));
        }
    }, [trackers, logs, loading]);

    const addTracker = (label: string, color: string, icon: string) => {
        const newTracker: Tracker = {
            id: crypto.randomUUID(),
            label,
            color,
            icon,
            createdAt: Date.now(),
        };
        setTrackers((prev) => [...prev, newTracker]);
    };

    const logOccurrence = (trackerId: string) => {
        const newLog: LogEntry = {
            id: crypto.randomUUID(),
            trackerId,
            timestamp: Date.now(),
        };
        setLogs((prev) => [...prev, newLog]);
    };

    const deleteTracker = (trackerId: string) => {
        setTrackers((prev) => prev.filter(t => t.id !== trackerId));
        setLogs((prev) => prev.filter(l => l.trackerId !== trackerId));
    };

    const loadDemoData = () => {
        const DAY = 24 * 60 * 60 * 1000;
        const now = Date.now();

        const demoTrackers: Tracker[] = [
            { id: 'demo-1', label: 'Coffee', color: '#8b5e3c', icon: 'Coffee', createdAt: now - 30 * DAY },
            { id: 'demo-2', label: 'Gym', color: '#3b82f6', icon: 'Dumbbell', createdAt: now - 60 * DAY },
            { id: 'demo-3', label: 'Plants', color: '#10b981', icon: 'Leaf', createdAt: now - 90 * DAY },
            { id: 'demo-4', label: 'Netflix', color: '#e50914', icon: 'Tv', createdAt: now - 120 * DAY },
            { id: 'demo-5', label: 'Health', color: '#f59e0b', icon: 'HeartPulse', createdAt: now - 200 * DAY },
            { id: 'demo-6', label: 'Dentist', color: '#6366f1', icon: 'Stethoscope', createdAt: now - 400 * DAY },
            { id: 'demo-7', label: 'Insurance', color: '#94a3b8', icon: 'ShieldCheck', createdAt: now - 800 * DAY },
        ];

        const demoLogs: LogEntry[] = [];

        const addLogs = (trackerId: string, intervalDays: number, count: number) => {
            for (let i = 0; i < count; i++) {
                demoLogs.push({
                    id: crypto.randomUUID(),
                    trackerId,
                    timestamp: now - (i * intervalDays * DAY) - (Math.random() * 0.2 * DAY)
                });
            }
        };

        addLogs('demo-1', 1, 10);      // daily
        addLogs('demo-2', 7, 5);       // weekly
        addLogs('demo-3', 14, 4);      // every other week
        addLogs('demo-4', 30, 3);      // monthly
        addLogs('demo-5', 60, 3);      // every other month
        addLogs('demo-6', 150, 2);     // every 5 months
        addLogs('demo-7', 400, 2);     // every year

        setTrackers(demoTrackers);
        setLogs(demoLogs);
    };

    return (
        <TrackerContext.Provider value={{ trackers, logs, loading, addTracker, logOccurrence, deleteTracker, loadDemoData }}>
            {children}
        </TrackerContext.Provider>
    );
};

export const useTrackerStore = () => {
    const context = useContext(TrackerContext);
    if (context === undefined) {
        throw new Error('useTrackerStore must be used within a TrackerProvider');
    }
    return context;
};
