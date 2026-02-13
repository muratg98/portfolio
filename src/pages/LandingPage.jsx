import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import AboutSection from '../components/landing/AboutSection';
import ProjectsSection from '../components/landing/ProjectsSection';
import SkillsSection from '../components/landing/SkillsSection';
import ExperienceSection from '../components/landing/ExperienceSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';
import '../components/landing/LandingStyles.css';

export default function LandingPage({ onEnterBrain }) {
  return (
    <div className="landing-page" data-theme="dark">
      {/* Starfield Background */}
      <div className="landing-stars" />
      
      <Navbar onEnterBrain={onEnterBrain} />
      
      <main>
        <Hero onEnterBrain={onEnterBrain} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
