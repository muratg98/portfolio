import { motion } from 'framer-motion';
import { Code2, Server, Wrench, Sparkles } from 'lucide-react';
import portfolioData from '../../data/portfolio.json';
import './ContentStyles.css';

const skillCategories = [
  { key: 'frontend', label: 'Frontend', icon: Code2, color: '#963CBD' },
  { key: 'backend', label: 'Backend', icon: Server, color: '#FF6F61' },
  { key: 'tools', label: 'Tools & DevOps', icon: Wrench, color: '#00D9FF' },
  { key: 'ai', label: 'AI Development', icon: Sparkles, color: '#4ADE80' },
];

export default function SkillsContent() {
  const { skills } = portfolioData;
  
  return (
    <div className="content-section">
      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <motion.div
            key={category.key}
            className="skill-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ '--category-color': category.color }}
          >
            <div className="skill-category-header">
              <category.icon size={20} style={{ color: category.color }} />
              <h4 className="skill-category-title">{category.label}</h4>
            </div>
            
            <div className="skill-list">
              {skills[category.key].map((skill, i) => (
                <motion.div
                  key={skill}
                  className="skill-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="skill-name">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Stats */}
      <div className="stats-row">
        {portfolioData.accomplishments.map((acc, index) => (
          <motion.div
            key={acc.id}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <span className="stat-value code-text">{acc.value}</span>
            <span className="stat-label">{acc.title}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
