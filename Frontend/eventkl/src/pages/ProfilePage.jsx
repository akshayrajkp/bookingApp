import { useAuth } from '../context/AuthContext';
import '../styles/ConfirmAndProfile.css';

export default function ProfilePage({ onNav }) {
  const { user, logout } = useAuth();

  // If somehow accessed while logged out, bounce to login
  if (!user) {
    onNav('login');
    return null;
  }

  const handleLogout = () => {
    logout();
    onNav('home');
  };

  return (
    <div className="profile-layout">
      {/* ── Sidebar ── */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          {(user.firstName?.[0] || user.sub?.[0] || 'U').toUpperCase()}
        </div>
        <div className="profile-name">
          {user.firstName} {user.lastName}
        </div>
        <div className="profile-email">{user.email || user.sub}</div>

        <div
          className="profile-menu-item active"
          onClick={() => onNav('profile')}
        >
          <span className="pmi-icon">👤</span>
          <span className="pmi-text">My Profile</span>
        </div>
        <div
          className="profile-menu-item"
          onClick={() => onNav('mytickets')}
        >
          <span className="pmi-icon">🎟</span>
          <span className="pmi-text">My Tickets</span>
        </div>
        <div className="profile-menu-item" onClick={handleLogout}>
          <span className="pmi-icon">🚪</span>
          <span className="pmi-text">Log out</span>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="profile-main">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 8 }}>
          My Profile
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: 36 }}>
          Your personal details from registration.
        </p>

        <div className="profile-stats">
          <div className="p-stat">
            <div className="p-stat-val">—</div>
            <div className="p-stat-label">Events Attended</div>
          </div>
          <div className="p-stat">
            <div className="p-stat-val">—</div>
            <div className="p-stat-label">Upcoming</div>
          </div>
          <div className="p-stat">
            <div className="p-stat-val">—</div>
            <div className="p-stat-label">Wishlist</div>
          </div>
        </div>

        {/* ── Detail fields ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          maxWidth: 600,
        }}>
          <ProfileField label="First Name" value={user.firstName} />
          <ProfileField label="Last Name"  value={user.lastName}  />
          <ProfileField label="Email"      value={user.email || user.sub} />
          {user.phone && <ProfileField label="Phone" value={user.phone} />}
        </div>
      </main>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 500, letterSpacing: 1,
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 16, fontWeight: 500, color: 'var(--ink)',
        padding: '12px 16px',
        background: 'var(--surface)',
        borderRadius: 10,
        border: '1px solid var(--border)',
      }}>
        {value || '—'}
      </div>
    </div>
  );
}
