import { useState, useEffect } from 'react';
import { Menu, X, Brain } from 'lucide-react';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ onEnterBrain }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleEnterBrain = () => {
    setIsMobileMenuOpen(false);
    onEnterBrain();
  };

  return (
    <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#" className="navbar-logo code-text">
          &lt;MG /&gt;
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className="navbar-link"
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Enter Brain CTA */}
        <button className="navbar-cta" onClick={handleEnterBrain}>
          <Brain size={18} />
          <span>Enter Brain</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className="navbar-link"
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button className="navbar-cta" onClick={handleEnterBrain}>
            <Brain size={18} />
            <span>Enter Brain</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
