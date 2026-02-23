import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Activity, Trash2, AlertTriangle } from 'lucide-react';
import type { LogEntry, Tracker } from '../store/TrackerStore';
import { format } from 'date-fns';
import { calculateStats, getFrequencyLabel } from '../utils/analytics';

interface AnalyticsViewProps {
    tracker: Tracker;
    logs: LogEntry[];
    onBack: () => void;
    onDelete: (id: string) => void;
}

const AnalyticsView = ({ tracker, logs, onBack, onDelete }: AnalyticsViewProps) => {
    const stats = useMemo(() => calculateStats(tracker, logs), [logs, tracker]);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
        setIsConfirming(true);
    };

    const confirmDelete = () => {
        onDelete(tracker.id);
        setIsConfirming(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="analytics-container"
            style={{ padding: '16px' }}
        >
            <button
                onClick={onBack}
                style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: tracker.color, padding: '12px', borderRadius: '16px' }}>
                    <Activity color="white" size={32} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem' }}>{tracker.label}</h2>
                    <p className="stats-label">Frequency Insights</p>
                </div>
            </div>

            {!stats ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Need at least 2 logs to calculate frequency stats.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', border: '1px solid var(--primary)' }}>
                        <div>
                            <p className="stats-label" style={{ color: 'var(--primary)' }}>Overall Frequency</p>
                            <h3 className="stats-value" style={{ fontSize: '1.8rem', textTransform: 'capitalize' }}>
                                {getFrequencyLabel(stats.avgIntervalDays)}
                            </h3>
                        </div>
                        <Activity size={32} color="var(--primary)" />
                    </div>

                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="stats-label">Daily Average</p>
                            <h3 className="stats-value">{stats.dailyAvg.toFixed(2)}</h3>
                        </div>
                        <Calendar size={28} color="var(--primary)" />
                    </div>

                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="stats-label">Monthly Average</p>
                            <h3 className="stats-value">{stats.monthlyAvg.toFixed(1)}</h3>
                        </div>
                        <Clock size={28} color="var(--accent)" />
                    </div>

                    <div className="glass-card">
                        <p className="stats-label" style={{ marginBottom: '12px' }}>Average Gap Between Events</p>
                        <h3 className="stats-value">{stats.avgIntervalDays.toFixed(1)} Days</h3>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                style={{ height: '100%', background: tracker.color }}
                            />
                        </div>
                    </div>

                    <div className="glass-card">
                        <p className="stats-label">Last Occurrence</p>
                        <p style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                            {format(stats.lastSeen, 'PPP')} at {format(stats.lastSeen, 'p')}
                        </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <button
                            onClick={handleDelete}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                borderRadius: '12px',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            <Trash2 size={20} /> Delete Tracker
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isConfirming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#ef4444' }}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '50%' }}>
                                    <AlertTriangle size={32} />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Delete Tracker?</h2>
                            <p className="stats-label" style={{ marginBottom: '24px', lineHeight: 1.5 }}>
                                Are you sure you want to delete <strong>"{tracker.label}"</strong>? All history and frequency data will be permanently removed.
                            </p>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}
                                    onClick={() => setIsConfirming(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#ef4444' }}
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AnalyticsView;
