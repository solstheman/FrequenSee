import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AnalyticsView from './components/AnalyticsView';
import { useTrackerStore, TrackerProvider } from './store/TrackerStore';
import './index.css';

function AppContent() {
  const { trackers, logs, loading, deleteTracker } = useTrackerStore();
  const [activeTrackerId, setActiveTrackerId] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white' }}>
        <p>Initializing...</p>
      </div>
    );
  }

  const activeTracker = trackers.find(t => t.id === activeTrackerId);
  const activeLogs = logs.filter(l => l.trackerId === activeTrackerId);

  const handleDelete = (id: string) => {
    deleteTracker(id);
    setActiveTrackerId(null);
  };

  return (
    <div className="App">
      {activeTrackerId && activeTracker ? (
        <AnalyticsView
          tracker={activeTracker}
          logs={activeLogs}
          onBack={() => setActiveTrackerId(null)}
          onDelete={handleDelete}
        />
      ) : (
        <Dashboard onShowStats={setActiveTrackerId} />
      )}

      {/* Footer / Info */}
      <footer style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px', padding: '16px', textAlign: 'center', background: 'linear-gradient(to top, var(--bg), transparent)', pointerEvents: 'none' }}>
        <p className="stats-label" style={{ opacity: 0.5 }}>Local Persistence Active</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
}

export default App;
