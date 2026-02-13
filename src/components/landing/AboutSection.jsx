import { User, Lightbulb, Heart, BookOpen, Rocket, Star, Github, GraduationCap } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function AboutSection() {
  const { about, accomplishments, publications } = portfolioData;

  const iconMap = {
    rocket: Rocket,
    star: Star,
    github: Github,
    pen: GraduationCap,
  };

  return (
    <section id="about" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// about me</span>
          <h2 className="section-title">Get to Know Me</h2>
        </div>

        <div className="bento-grid about-grid">
          {/* Row 1: Story (7) + Highlights (5) */}
          <div className="bento-card about-story-card glass-card">
            <div className="card-icon">
              <User size={24} />
            </div>
            <h3 className="card-title">My Story</h3>
            <p className="card-text">{about.story}</p>
          </div>

          <div className="bento-card about-highlights-card glass-card stats-card">
            <div className="card-icon">
              <Rocket size={24} />
            </div>
            <h3 className="card-title">Highlights</h3>
            <div className="stats-grid">
              {accomplishments.map((acc) => {
                const IconComponent = iconMap[acc.icon] || Star;
                return (
                  <div key={acc.id} className="stat-item">
                    <div className="stat-icon">
                      <IconComponent size={18} />
                    </div>
                    <span className="stat-value">{acc.value}</span>
                    <span className="stat-label">{acc.description}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Approach (6) + Interests (3) + Publication (3) */}
          <div className="bento-card about-approach-card glass-card">
            <div className="card-icon">
              <Lightbulb size={24} />
            </div>
            <h3 className="card-title">My Approach</h3>
            <p className="card-text">{about.approach}</p>
          </div>

          <div className="bento-card about-interests-card glass-card">
            <div className="card-icon">
              <Heart size={24} />
            </div>
            <h3 className="card-title">Interests</h3>
            <div className="tags-container">
              {about.interests.map((interest, idx) => (
                <span key={idx} className="tag">{interest}</span>
              ))}
            </div>
          </div>

          {publications && publications.length > 0 && (
            <div className="bento-card about-publication-card glass-card publication-card">
              <div className="card-icon">
                <BookOpen size={24} />
              </div>
              <h3 className="card-title">Published</h3>
              <div className="publication-info">
                <p className="publication-title">{publications[0].title}</p>
                <span className="publication-journal">
                  {publications[0].journal}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
