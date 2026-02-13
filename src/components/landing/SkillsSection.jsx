import { Monitor, Server, Wrench, Sparkles } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function SkillsSection() {
  const { skills } = portfolioData;

  const skillCategories = [
    {
      key: 'frontend',
      title: 'Frontend',
      icon: Monitor,
      color: '#00D9FF',
      items: skills.frontend,
    },
    {
      key: 'backend',
      title: 'Backend',
      icon: Server,
      color: '#963CBD',
      items: skills.backend,
    },
    {
      key: 'tools',
      title: 'Tools & DevOps',
      icon: Wrench,
      color: '#C5299B',
      items: skills.tools,
    },
    {
      key: 'ai',
      title: 'AI & Automation',
      icon: Sparkles,
      color: '#f59e0b',
      items: skills.ai,
    },
  ];

  return (
    <section id="skills" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// tech stack</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            Technologies I use to bring ideas to life
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.key} 
                className="glass-card skill-category-card"
                style={{ '--skill-accent': category.color }}
              >
                <div className="skill-card-header">
                  <div className="skill-icon" style={{ color: category.color }}>
                    <IconComponent size={24} />
                  </div>
                  <h3 className="skill-category-title">{category.title}</h3>
                </div>
                
                <div className="skill-items">
                  {category.items.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <span className="skill-name">{skill}</span>
                    </div>
                  ))}
                </div>
                
                <div className="skill-accent-line" style={{ background: category.color }} />
              </div>
            );
          })}
        </div>

        {/* Skills Cloud - Alternative visualization */}
        <div className="skills-cloud glass-card">
          <div className="skills-cloud-inner">
            {Object.values(skills).flat().map((skill, idx) => (
              <span 
                key={idx} 
                className="skill-cloud-tag"
                style={{ 
                  animationDelay: `${idx * 0.1}s`,
                  fontSize: `${0.85 + Math.random() * 0.3}rem`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
