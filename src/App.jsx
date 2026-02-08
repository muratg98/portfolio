import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThemeProvider } from './context/ThemeContext';
import BrainPortfolio from './components/three/BrainPortfolio';
import Modal from './components/ui/Modal';
import ThemeToggle from './components/ui/ThemeToggle';
import MeContent from './components/content/MeContent';
import ProjectsContent from './components/content/ProjectsContent';
import ExperienceContent from './components/content/ExperienceContent';
import SkillsContent from './components/content/SkillsContent';
import ContactContent from './components/content/ContactContent';
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
  me: { title: 'About Me', component: MeContent },
  projects: { title: 'Projects', component: ProjectsContent },
  experience: { title: 'Experience', component: ExperienceContent },
  skills: { title: 'Skills', component: SkillsContent },
  contact: { title: 'Contact', component: ContactContent },
};

function App() {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleCloseModal = () => {
    setActiveSection(null);
  };

  const ActiveContent = activeSection ? sectionContent[activeSection]?.component : null;

  return (
    <ThemeProvider>
      <div className="brain-portfolio">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Full-screen 3D Brain Canvas */}
        <div className="brain-canvas">
          <Suspense fallback={<LoadingScreen />}>
            <Canvas
              camera={{ position: [0, 25, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <BrainPortfolio onSectionClick={handleSectionClick} />
            </Canvas>
          </Suspense>
        </div>

        {/* Instructions */}
        <div className="brain-instructions">
          <span className="code-text">// drag to rotate • scroll to zoom • click a node</span>
        </div>

        {/* Credit */}
        <div className="brain-credit">
          <span className="code-text">designed by MGRyko</span>
        </div>

        {/* Modal for section content */}
        <Modal
          isOpen={activeSection !== null}
          onClose={handleCloseModal}
          title={activeSection ? sectionContent[activeSection]?.title : ''}
        >
          {ActiveContent && <ActiveContent />}
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default App;
