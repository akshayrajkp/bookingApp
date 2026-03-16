import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { key: 'home',      label: 'Home'       },
  { key: 'explore',   label: 'Explore'    },
  { key: 'mytickets', label: 'My Tickets' },
];

export default function Navbar({ page, onNav }) {
  const { user } = useAuth();
  return (
    <div className="topbar">
      <div className="logo" onClick={() => onNav('home')}>EventKL</div>

      <nav className="topnav">
        {navLinks.map(l => (
          <a
            key={l.key}
            className={page === l.key ? 'active' : ''}
            onClick={() => onNav(l.key)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="topbar-right">
        {user ? (
          <div
            className="navbar-avatar"
            title="View Profile"
            onClick={() => onNav('profile')}
          >
            {(user.firstName?.[0] || user.sub?.[0] || 'U').toUpperCase()}
          </div>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => onNav('login')}>Sign in</button>
            <button className="btn-solid" onClick={() => onNav('explore')}>Get Tickets</button>
          </>
        )}
      </div>
    </div>
  );
}
