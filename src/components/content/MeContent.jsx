import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar, Github, Linkedin, Twitter } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

export default function MeContent() {
  const { profile, about, social } = portfolioData;
  const [imageError, setImageError] = useState(false);
  
  // Get initials for fallback avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="content-section">
      {/* Profile Header */}
      <div className="me-header">
        <motion.div 
          className="me-image-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!imageError ? (
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="me-image" 
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="me-image-fallback">
              <span>{getInitials(profile.name)}</span>
            </div>
          )}
          <div className="me-image-glow" />
        </motion.div>
        
        <div className="me-info">
          <h3 className="me-name">{profile.name}</h3>
          <p className="me-title code-text">{profile.title}</p>
          
          <div className="me-meta">
            <span className="me-meta-item">
              <MapPin size={14} />
              {profile.location}
            </span>
            <span className="me-meta-item">
              <Mail size={14} />
              {profile.email}
            </span>
            <span className="me-meta-item status-available">
              <Calendar size={14} />
              {profile.availability}
            </span>
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div className="content-block">
        <h4 className="content-label">Bio</h4>
        <p className="content-text">{profile.bio}</p>
      </div>
      
      {/* Story */}
      <div className="content-block">
        <h4 className="content-label">My Story</h4>
        <p className="content-text">{about.story}</p>
      </div>
      
      {/* Approach */}
      <div className="content-block">
        <h4 className="content-label">My Approach</h4>
        <p className="content-text">{about.approach}</p>
      </div>
      
      {/* Interests */}
      <div className="content-block">
        <h4 className="content-label">Interests</h4>
        <div className="tag-list">
          {about.interests.map((interest, index) => (
            <span key={index} className="tag">{interest}</span>
          ))}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="content-block">
        <h4 className="content-label">Connect</h4>
        <div className="social-links">
          <a href={social.github} target="_blank" rel="noopener noreferrer" className="social-link">
            <Github size={18} />
            <span>GitHub</span>
          </a>
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </a>
          <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
            <Twitter size={18} />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
}
