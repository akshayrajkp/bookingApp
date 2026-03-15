import '../styles/Footer.css';

const discover  = ['Music', 'Theatre', 'Workshops', 'Talks', 'Dance'];
const company   = ['About', 'Press', 'Careers', 'Blog', 'Contact'];
const support   = ['Help Centre', 'Refunds', 'Organiser Login', 'API', 'Privacy'];

export default function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">EventKL</div>
          <div className="footer-tagline">
            Kerala's premier destination for discovering and booking cultural events,
            concerts, and experiences.
          </div>
        </div>

        <div>
          <div className="footer-h">Discover</div>
          <div className="footer-links">
            {discover.map(l => (
              <span key={l} className="footer-link" onClick={() => onNav('explore')}>{l}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-h">Company</div>
          <div className="footer-links">
            {company.map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
        </div>

        <div>
          <div className="footer-h">Support</div>
          <div className="footer-links">
            {support.map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2025 EventKL. All rights reserved.</div>
        <div className="footer-copy">Made in Kerala 🌴</div>
      </div>
    </footer>
  );
}
