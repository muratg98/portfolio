import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

export default function EducationContent() {
  const { education, publications } = portfolioData;
  
  return (
    <div className="content-section">
      <div className="timeline">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="timeline-marker">
              <div className="timeline-dot" style={{ background: '#4ADE80' }} />
              {index < education.length - 1 && <div className="timeline-line" />}
            </div>
            
            <div className="timeline-content">
              <div className="experience-header">
                <h4 className="experience-role">{edu.degree}</h4>
                <span className="experience-type fulltime" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' }}>
                  {edu.grade}
                </span>
              </div>
              
              <div className="experience-meta">
                <span className="experience-company">
                  <GraduationCap size={14} />
                  {edu.institution}
                </span>
                <span className="experience-period">
                  <Calendar size={14} />
                  {edu.period}
                </span>
              </div>
              
              <p className="experience-description" style={{ color: '#4ADE80' }}>
                <BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} />
                {edu.field}
              </p>
              
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="experience-highlights">
                  {edu.highlights.map((highlight, i) => (
                    <li key={i} className="highlight-item">
                      <span className="highlight-bullet code-text">&gt;</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Publications Section */}
      {publications && publications.length > 0 && (
        <div className="content-block" style={{ marginTop: '24px' }}>
          <h4 className="content-label" style={{ color: '#4ADE80' }}>
            <Award size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Publications
          </h4>
          {publications.map((pub) => (
            <motion.div
              key={pub.id}
              className="publication-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '12px'
              }}
            >
              <h5 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '14px' }}>
                {pub.title}
              </h5>
              <p style={{ margin: '0 0 8px 0', color: '#4ADE80', fontSize: '12px' }}>
                {pub.journal} • {pub.date}
              </p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                {pub.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
