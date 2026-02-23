import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import type { Tracker } from '../store/TrackerStore';

interface TrackerCardProps {
    tracker: Tracker;
    onLog: (id: string) => void;
    frequencyLabel: string;
}

const TrackerCard = ({ tracker, onLog, frequencyLabel }: TrackerCardProps) => {
    const [showSuccess, setShowSuccess] = useState(false);

    // Dynamic icon lookup
    // @ts-ignore
    const IconComponent = Lucide[tracker.icon] || Lucide.Activity;

    const handleLog = (e: React.MouseEvent) => {
        e.stopPropagation();
        onLog(tracker.id);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
    };

    return (
        <motion.div
            className="glass-card"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                borderLeft: `4px solid ${tracker.color}`
            }}
            onClick={() => onLog(tracker.id)}
        >
            <div
                style={{
                    backgroundColor: `${tracker.color}20`,
                    padding: '12px',
                    borderRadius: '16px',
                    color: tracker.color
                }}
            >
                <IconComponent size={32} />
            </div>

            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{tracker.label}</h3>
                <span className="stats-label" style={{ textTransform: 'capitalize' }}>{frequencyLabel}</span>
            </div>

            <motion.button
                className="btn-primary"
                style={{
                    width: '100%',
                    marginTop: '8px',
                    background: showSuccess ? '#10b981' : tracker.color,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    transition: 'background-color 0.3s ease'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLog}
            >
                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Lucide.CheckCircle2 size={16} />
                            <span>Logged!</span>
                        </motion.div>
                    ) : (
                        <motion.span
                            key="track"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                        >
                            Track
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
};

export default TrackerCard;
