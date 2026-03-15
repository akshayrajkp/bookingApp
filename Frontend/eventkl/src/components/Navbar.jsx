import '../styles/Navbar.css';

const navLinks = [
  { key: 'home',      label: 'Home'       },
  { key: 'explore',   label: 'Explore'    },
  { key: 'mytickets', label: 'My Tickets' },
];

export default function Navbar({ page, onNav }) {
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
        <button className="btn-ghost" onClick={() => onNav('login')}>Sign in</button>
        <button className="btn-solid" onClick={() => onNav('explore')}>Get Tickets</button>
      </div>
    </div>
  );
}
