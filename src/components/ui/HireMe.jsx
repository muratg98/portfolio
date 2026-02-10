import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Floating "Hire Me" CTA button with modal for contractual work offer.
 * Features a free landing page offer to showcase work quality.
 */
function HireMe() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating CTA Button */}
      <button 
        className="hire-me-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Hire me for web development"
      >
        <span className="hire-me-pulse" />
        <span className="hire-me-text">Hire Me</span>
      </button>

      {/* Modal Overlay - Rendered via Portal to body */}
      {isOpen && createPortal(
        <div 
          className="hire-me-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="hire-me-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="hire-me-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Header */}
            <div className="hire-me-header">
              <span className="hire-me-badge">Limited Offer</span>
              <h2 className="hire-me-title">
                Get a <span className="hire-me-highlight">Free</span> Landing Page
              </h2>
              <p className="hire-me-subtitle">
                See exactly what I can build for you — no commitment required.
              </p>
            </div>

            {/* Content */}
            <div className="hire-me-content">
              <div className="hire-me-offer">
                <h3>What You'll Get:</h3>
                <ul className="hire-me-list">
                  <li>
                    <span className="hire-me-check">&#10003;</span>
                    Custom-designed landing page mockup
                  </li>
                  <li>
                    <span className="hire-me-check">&#10003;</span>
                    Responsive design preview
                  </li>
                  <li>
                    <span className="hire-me-check">&#10003;</span>
                    Modern UI/UX tailored to your brand
                  </li>
                  <li>
                    <span className="hire-me-check">&#10003;</span>
                    No strings attached
                  </li>
                </ul>
              </div>

              <div className="hire-me-services">
                <h3>Full Services Available:</h3>
                <div className="hire-me-tags">
                  <span className="hire-me-tag">Landing Pages</span>
                  <span className="hire-me-tag">Web Applications</span>
                  <span className="hire-me-tag">E-commerce</span>
                  <span className="hire-me-tag">Dashboards</span>
                  <span className="hire-me-tag">Portfolio Sites</span>
                  <span className="hire-me-tag">SaaS Platforms</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="hire-me-cta">
              <a 
                href="mailto:muratgungor.work@gmail.com?subject=Free Landing Page Request"
                className="hire-me-cta-btn"
              >
                Claim Your Free Landing Page
              </a>
              <p className="hire-me-note">
                or reach out via the <button className="hire-me-link" onClick={() => setIsOpen(false)}>Contact</button> section
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default HireMe;
