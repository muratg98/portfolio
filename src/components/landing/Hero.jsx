import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import HeroBrain from './HeroBrain';
import portfolioData from '../../data/portfolio.json';

// Brain canvas component to avoid duplication
function BrainCanvas({ onEnterBrain }) {
  return (
    <div className="hero-brain-container" onClick={onEnterBrain}>
      <Suspense fallback={
        <div className="brain-loading">
          <div className="brain-loading-pulse" />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ cursor: 'pointer' }}
        >
          <HeroBrain />
        </Canvas>
      </Suspense>
      <div className="brain-glow" />
    </div>
  );
}

export default function Hero({ onEnterBrain }) {
  const { profile, social } = portfolioData;

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            <span>{profile.availability}</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Hi, I'm</span>
            <span className="title-name">{profile.name}</span>
          </h1>
          
          <h2 className="hero-subtitle code-text">
            Psychologist turned Full-Stack Developer
          </h2>
          
          <p className="hero-tagline">
            4+ years building everything from AI-powered tools and SaaS platforms to open-source developer utilities and e-commerce solutions.
          </p>
          
          {/* Mobile brain - shows between tagline and CTA */}
          <div className="hero-brain-mobile">
            <BrainCanvas onEnterBrain={onEnterBrain} />
          </div>
          
          <div className="hero-ctas">
            <button className="hero-cta-primary" onClick={onEnterBrain}>
              <span>Explore My Brain</span>
              <ArrowRight size={18} />
            </button>
            
            <a href={`mailto:${profile.email}`} className="hero-cta-secondary">
              <Mail size={18} />
              <span>Hire Me</span>
            </a>
            
            <div className="hero-social">
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Github size={20} />
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="hero-hint">
            <span className="hint-text code-text">// click the brain to enter</span>
          </div>
        </div>

        {/* Right - 3D Brain (Desktop only) */}
        <div className="hero-brain-wrapper hero-brain-desktop">
          <BrainCanvas onEnterBrain={onEnterBrain} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
}
