import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

export default function ContactContent() {
  const { profile, social } = portfolioData;
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };
  
  return (
    <div className="content-section">
      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info">
          <div className="content-block">
            <h4 className="content-label">Let's Connect</h4>
            <p className="content-text">
              Have a project in mind or just want to chat? Feel free to reach out.
              I'm always open to discussing new opportunities.
            </p>
          </div>
          
          <div className="contact-details">
            <a href={`mailto:${profile.email}`} className="contact-item">
              <Mail size={18} />
              <span>{profile.email}</span>
            </a>
            <div className="contact-item">
              <MapPin size={18} />
              <span>{profile.location}</span>
            </div>
          </div>
          
          <div className="content-block">
            <h4 className="content-label">Social</h4>
            <div className="social-links">
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={18} />
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={18} />
              </a>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <motion.form 
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="form-group">
            <label className="form-label code-text">name:</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="form-input"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label code-text">email:</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="form-input"
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label code-text">message:</label>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Your message..."
              rows={4}
              required
            />
          </div>
          
          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || submitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitted ? (
              <>
                <span className="code-text">message_sent</span>
                <span style={{ color: '#00D9FF' }}>✓</span>
              </>
            ) : isSubmitting ? (
              <span className="code-text">sending...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Send Message</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
