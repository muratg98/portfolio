import { Mail, MapPin, Github, Linkedin, Twitter, ArrowRight, Send } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function ContactSection() {
  const { profile, social } = portfolioData;

  return (
    <section id="contact" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// contact</span>
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle">
            Have a project in mind or want to chat? I'd love to hear from you.
          </p>
        </div>

        <div className="bento-grid contact-grid">
          {/* Main Contact Card */}
          <div className="bento-card bento-card-lg glass-card contact-main-card">
            <div className="contact-main-content">
              <h3 className="contact-heading">Get in Touch</h3>
              <p className="contact-intro">
                I'm currently {profile.availability.toLowerCase()}. Whether you have a question, 
                a project idea, or just want to say hello - my inbox is always open.
              </p>
              
              <div className="contact-details">
                <a href={`mailto:${profile.email}`} className="contact-detail-item">
                  <Mail size={20} />
                  <span>{profile.email}</span>
                </a>
                <div className="contact-detail-item">
                  <MapPin size={20} />
                  <span>{profile.location}</span>
                </div>
              </div>
              
              <a href={`mailto:${profile.email}`} className="contact-cta-button">
                <span>Send me a message</span>
                <Send size={18} />
              </a>
            </div>
            
            <div className="contact-decoration">
              <div className="contact-glow" />
            </div>
          </div>

          {/* Availability Card */}
          <div className="bento-card bento-card-sm glass-card availability-card">
            <div className="availability-status">
              <span className="availability-dot" />
              <span className="availability-text">{profile.availability}</span>
            </div>
            <p className="availability-description">
              Looking for full-time opportunities and interesting freelance projects.
            </p>
          </div>

          {/* Social Links Card */}
          <div className="bento-card bento-card-sm glass-card social-card">
            <h4 className="social-card-title">Find me online</h4>
            <div className="social-links">
              <a 
                href={social.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link-item"
              >
                <Github size={22} />
                <span>GitHub</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href={social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link-item"
              >
                <Linkedin size={22} />
                <span>LinkedIn</span>
                <ArrowRight size={16} />
              </a>
              {social.twitter && (
                <a 
                  href={social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link-item"
                >
                  <Twitter size={22} />
                  <span>Twitter</span>
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
