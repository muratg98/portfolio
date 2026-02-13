import { Briefcase, Calendar, ArrowRight, Building2 } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function ExperienceSection() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// career</span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            My professional journey in software development
          </p>
        </div>

        <div className="experience-timeline">
          {experience.map((exp, idx) => (
            <div key={exp.id} className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot" />
                {idx < experience.length - 1 && <div className="timeline-line" />}
              </div>
              
              <div className="bento-card glass-card experience-card">
                <div className="experience-header">
                  <div className="experience-role-section">
                    <h3 className="experience-role">{exp.role}</h3>
                    <div className="experience-company">
                      <Building2 size={16} />
                      <span>{exp.company}</span>
                      {exp.type === 'freelance' && (
                        <span className="experience-type-badge">Freelance</span>
                      )}
                    </div>
                  </div>
                  <div className="experience-period">
                    <Calendar size={14} />
                    <span className="code-text">{exp.period}</span>
                  </div>
                </div>
                
                <p className="experience-description">{exp.description}</p>
                
                <div className="experience-highlights">
                  {exp.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="highlight-item">
                      <ArrowRight size={14} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
