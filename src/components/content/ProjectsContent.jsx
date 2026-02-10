import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

// Parse period string to get a sortable date value (higher = more recent)
function getDateValue(period) {
  if (!period) return 0;
  
  // "Ongoing" projects are most recent
  if (period.toLowerCase().includes('ongoing')) return 9999;
  
  const months = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
  };
  
  // Try to find year and month - look for end date first (after "-"), otherwise start date
  const parts = period.split('-');
  const datePart = parts.length > 1 ? parts[1].trim() : parts[0].trim();
  
  // Match "Mon YYYY" or just "YYYY"
  const monthMatch = datePart.toLowerCase().match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  const yearMatch = datePart.match(/(\d{4})/);
  
  const year = yearMatch ? parseInt(yearMatch[1]) : 2020;
  const month = monthMatch ? months[monthMatch[1]] : 12;
  
  return year * 100 + month;
}

// Sort projects: featured first, then by date (most recent first)
function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    // Featured projects always first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then by date (most recent first)
    return getDateValue(b.period) - getDateValue(a.period);
  });
}

export default function ProjectsContent() {
  const { projects } = portfolioData;
  const sortedProjects = sortProjects(projects);
  
  return (
    <div className="content-section">
      <div className="projects-grid">
        {sortedProjects.map((project, index) => (
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
