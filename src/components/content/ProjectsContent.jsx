import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

export default function ProjectsContent() {
  const { projects } = portfolioData;
  
  return (
    <div className="content-section">
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ '--project-color': project.color }}
          >
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-overlay">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={18} />
                </a>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <Github size={18} />
                </a>
              </div>
            </div>
            
            <div className="project-content">
              <h4 className="project-title">{project.title}</h4>
              <p className="project-description">{project.description}</p>
              
              <div className="tag-list">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag tag-small">{tag}</span>
                ))}
              </div>
            </div>
            
            {project.featured && (
              <div className="project-badge">Featured</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
