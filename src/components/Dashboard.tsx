import { useState } from 'react';
import TrackerCard from './TrackerCard';
import { useTrackerStore } from '../store/TrackerStore';
import { Plus, BarChart2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateStats, getFrequencyLabel } from '../utils/analytics';

const Dashboard = ({ onShowStats }: { onShowStats: (id: string) => void }) => {
    const { trackers, logs, logOccurrence, addTracker, loadDemoData } = useTrackerStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newLabel, setNewLabel] = useState('');

    const handleAdd = () => {
        if (newLabel.trim()) {
            const colors = ['#9d50bb', '#6e48aa', '#ff0080', '#10b981', '#f59e0b', '#3b82f6'];
            const icons = ['Coffee', 'Dumbbell', 'Flame', 'Moon', 'Heart', 'Zap'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];

            addTracker(newLabel, randomColor, randomIcon);
            setNewLabel('');
            setIsAdding(false);
        }
    };

    return (
        <div style={{ flex: 1, paddingBottom: '80px' }}>
            <header style={{ padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Tracker</h1>
                    <p className="stats-label">Track your life habits</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={loadDemoData}
                        style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px', padding: '0 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Load Demo
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Plus />
                    </button>
                </div>
            </header>

            <div className="tracker-grid">
                {trackers.map(tracker => {
                    const trackerLogs = logs.filter(l => l.trackerId === tracker.id);
                    const stats = calculateStats(tracker, trackerLogs);
                    const frequencyLabel = stats ? getFrequencyLabel(stats.avgIntervalDays) : `${trackerLogs.length} logs`;

                    return (
                        <div key={tracker.id} style={{ position: 'relative' }}>
                            <TrackerCard
                                tracker={tracker}
                                onLog={logOccurrence}
                                frequencyLabel={frequencyLabel}
                            />
                            <button
                                onClick={() => onShowStats(tracker.id)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                            >
                                <BarChart2 size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '400px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2>New Tracker</h2>
                                <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X /></button>
                            </div>
                            <input
                                autoFocus
                                type="text"
                                placeholder="What are you tracking?"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', fontSize: '1rem', marginBottom: '20px' }}
                            />
                            <button
                                className="btn-primary"
                                style={{ width: '100%' }}
                                onClick={handleAdd}
                            >
                                Create Tracker
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
