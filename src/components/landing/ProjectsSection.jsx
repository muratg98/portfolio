import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';

export default function ProjectsSection() {
  const { projects } = portfolioData;
  
  // Sort: featured first, then by id
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.id - b.id;
  });

  // Take top 6 for the landing page
  const displayProjects = sortedProjects.slice(0, 6);

  return (
    <section id="projects" className="landing-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag code-text">// my work</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of projects showcasing my skills in full-stack development, AI integration, and user experience
          </p>
        </div>

        <div className="projects-grid">
          {displayProjects.map((project) => (
            <div 
              key={project.id} 
              className="glass-card project-card"
              style={{ '--project-accent': project.color }}
            >
              <div className="project-header">
                <span className="project-period code-text">{project.period}</span>
                <div className="project-links">
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <Github size={18} />
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              
              {project.highlights && project.highlights.length > 0 && (
                <div className="project-highlights">
                  {project.highlights.slice(0, 2).map((highlight, hIdx) => (
                    <div key={hIdx} className="highlight-item">
                      <ArrowRight size={14} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="project-tags">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="project-tag">{tag}</span>
                ))}
              </div>
              
              <div className="project-accent-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
