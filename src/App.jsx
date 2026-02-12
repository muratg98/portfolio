import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import BrainPortfolio, { SECTION_COLORS } from './components/three/BrainPortfolio';
import HireMe from './components/ui/HireMe';
import MeContent from './components/content/MeContent';
import ProjectsContent from './components/content/ProjectsContent';
import ExperienceContent from './components/content/ExperienceContent';
import SkillsContent from './components/content/SkillsContent';
import ContactContent from './components/content/ContactContent';
import EducationContent from './components/content/EducationContent';
import './index.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-brain">
        <div className="loading-pulse" />
        <span className="loading-text code-text">initializing_neural_network.exe</span>
        <span className="terminal-cursor" />
      </div>
    </div>
  );
}

const sectionContent = {
  me: { title: 'Me', component: MeContent },
  projects: { title: 'Projects', component: ProjectsContent },
  experience: { title: 'Experience', component: ExperienceContent },
  skills: { title: 'Skills', component: SkillsContent },
  contact: { title: 'Contact', component: ContactContent },
  education: { title: 'Education', component: EducationContent },
};

const SECTIONS = [
  { id: 'me', label: 'Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
  { id: 'education', label: 'Education' },
];

function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setShowContent(false);
  };

  const handleBack = () => {
    setShowContent(false);
    setActiveSection(null);
  };

  const handleZoomComplete = () => {
    setShowContent(true);
  };

  // Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeSection) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  const ActiveContent = activeSection ? sectionContent[activeSection]?.component : null;
  const sectionColor = activeSection ? SECTION_COLORS[activeSection] : '#963CBD';

  return (
      <div className="brain-portfolio" data-theme="dark">
        {/* Floating Navigation Bar */}
        {!activeSection && (
          <nav className="floating-nav">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                className="nav-node"
                onClick={() => handleSectionClick(section.id)}
                style={{
                  '--node-color': SECTION_COLORS[section.id],
                }}
              >
                <span className="nav-node-box" />
                <span className="nav-node-label">{section.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Full-screen 3D Brain Canvas */}
        <div className="brain-canvas">
          <Suspense fallback={<LoadingScreen />}>
            <Canvas
              camera={{ position: [0, 25, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={isMobile ? [1, 1.5] : [1, 2]}
              style={{ touchAction: 'none' }}
            >
              <BrainPortfolio 
                onSectionClick={handleSectionClick}
                activeSection={activeSection}
                onBack={handleBack}
                onZoomComplete={handleZoomComplete}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Content Overlay - centered on screen */}
        {showContent && activeSection && ActiveContent && (
          <div 
            className="content-overlay"
            onClick={handleBack}
            onWheel={(e) => {
              // Only exit if scrolling on the backdrop, not the modal
              if (e.target === e.currentTarget && e.deltaY > 0) {
                handleBack();
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
              boxSizing: 'border-box',
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              className="content-modal"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.85) 0%, rgba(10, 10, 20, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: `2px solid ${sectionColor}`,
                padding: '32px',
                color: '#fff',
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: `0 0 40px ${sectionColor}44, 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
                position: 'relative',
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: `${sectionColor}44`,
                  border: `1px solid ${sectionColor}`,
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.background = `${sectionColor}88`}
                onMouseOut={(e) => e.target.style.background = `${sectionColor}44`}
              >
                ← Back
              </button>
              <h2 style={{ 
                margin: '0 0 24px 0', 
                color: sectionColor,
                textShadow: `0 0 20px ${sectionColor}`,
                fontSize: '28px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {sectionContent[activeSection]?.title}
              </h2>
              <div style={{ opacity: 0.95 }}>
                <ActiveContent />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar - Instructions + Hire Me Button */}
        {!activeSection && (
          <div className="bottom-bar">
            <div className="brain-instructions">
              <span className="code-text">
                {isMobile 
                  ? '// drag to rotate • pinch to zoom • tap a node'
                  : '// drag to rotate • scroll to zoom • click a node'
                }
              </span>
            </div>
            <HireMe />
          </div>
        )}

        {/* Credit */}
        <div className="brain-credit">
          <span className="code-text">designed by MGRyko</span>
        </div>
      </div>
  );
}

export default App;
