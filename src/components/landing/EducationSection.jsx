import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function EducationSection() {
  const { education, publications } = portfolioData;

  return (
    <section id="education" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// education</span>
          <h2 className="section-title">Academic Background</h2>
          <p className="section-subtitle">
            From psychology research to software engineering
          </p>
        </div>

        <div className="bento-grid education-grid">
          {education.map((edu) => (
            <div key={edu.id} className="bento-card glass-card education-card">
              <div className="education-header">
                <div className="education-icon">
                  <GraduationCap size={24} />
                </div>
                <div className="education-period">
                  <Calendar size={14} />
                  <span className="code-text">{edu.period}</span>
                </div>
              </div>
              
              <h3 className="education-degree">{edu.degree}</h3>
              <p className="education-field">{edu.field}</p>
              <p className="education-institution">{edu.institution}</p>
              
              {edu.grade && (
                <div className="education-grade">
                  <Award size={16} />
                  <span>{edu.grade}</span>
                </div>
              )}
              
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="education-highlights">
                  {edu.highlights.map((highlight, idx) => (
                    <p key={idx} className="education-highlight">
                      {highlight}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Publications Card */}
          {publications && publications.length > 0 && (
            <div className="bento-card glass-card publication-feature-card">
              <div className="publication-feature-header">
                <div className="publication-icon">
                  <BookOpen size={24} />
                </div>
                <span className="publication-badge">Published Research</span>
              </div>
              
              <h3 className="publication-feature-title">{publications[0].title}</h3>
              
              <div className="publication-meta">
                <span className="publication-journal">{publications[0].journal}</span>
                <span className="publication-date">{publications[0].date}</span>
              </div>
              
              <p className="publication-description">{publications[0].description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
