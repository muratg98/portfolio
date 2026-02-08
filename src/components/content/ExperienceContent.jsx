import { motion } from 'framer-motion';
import { Briefcase, Building2, Clock } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

export default function ExperienceContent() {
  const { experience } = portfolioData;
  
  return (
    <div className="content-section">
      <div className="timeline">
        {experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="timeline-marker">
              <div className="timeline-dot" />
              {index < experience.length - 1 && <div className="timeline-line" />}
            </div>
            
            <div className="timeline-content">
              <div className="experience-header">
                <h4 className="experience-role">{exp.role}</h4>
                <span className={`experience-type ${exp.type}`}>
                  {exp.type === 'freelance' ? 'Freelance' : 'Full-time'}
                </span>
              </div>
              
              <div className="experience-meta">
                <span className="experience-company">
                  <Building2 size={14} />
                  {exp.company}
                </span>
                <span className="experience-period">
                  <Clock size={14} />
                  {exp.period}
                </span>
              </div>
              
              <p className="experience-description">{exp.description}</p>
              
              <ul className="experience-highlights">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="highlight-item">
                    <span className="highlight-bullet code-text">&gt;</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
