import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import LandingPage from './pages/LandingPage';
import './index.css';

// Lazy load BrainExperience - only loads when user enters brain mode
const BrainExperience = lazy(() => import('./pages/BrainExperience'));

function BrainLoadingScreen() {
  return (
    <div className="brain-loading-screen">
      <div className="loading-brain">
        <div className="loading-pulse" />
        <span className="loading-text code-text">initializing_neural_network.exe</span>
        <span className="terminal-cursor" />
      </div>
    </div>
  );
}

function App() {
  const [isInBrainMode, setIsInBrainMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState(null);
  const [brainKey, setBrainKey] = useState(0); // Key to force remount

  // Handle entering the brain experience
  const handleEnterBrain = useCallback(() => {
    setIsTransitioning(true);
    setTransitionPhase('zoom-in');
    
    // After zoom animation, switch to brain mode
    setTimeout(() => {
      setBrainKey(prev => prev + 1); // New key forces fresh mount
      setIsInBrainMode(true);
      setTransitionPhase(null);
      setIsTransitioning(false);
    }, 800);
  }, []);

  // Handle returning to landing page
  const handleBackToLanding = useCallback(() => {
    setIsTransitioning(true);
    setTransitionPhase('zoom-out');
    
    // After zoom-out animation, switch to landing
    setTimeout(() => {
      setIsInBrainMode(false);
      setTransitionPhase(null);
      setIsTransitioning(false);
      // Scroll to top when returning
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 600);
  }, []);

  return (
    <div className="app-root" data-theme="dark">
      {/* Transition Overlay */}
      <div className={`transition-overlay ${transitionPhase ? 'active' : ''} ${transitionPhase || ''}`}>
        <div className="transition-circle" />
      </div>

      {/* Page Content */}
      <div className={`page-container ${isTransitioning ? 'transitioning' : ''}`}>
        {isInBrainMode ? (
          <Suspense fallback={<BrainLoadingScreen />}>
            <BrainExperience key={brainKey} onBack={handleBackToLanding} />
          </Suspense>
        ) : (
          <LandingPage onEnterBrain={handleEnterBrain} />
        )}
      </div>
    </div>
  );
}

export default App;
