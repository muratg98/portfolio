import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p className="footer-copyright">
            <span>Built with</span>
            <Heart size={16} className="heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
}
