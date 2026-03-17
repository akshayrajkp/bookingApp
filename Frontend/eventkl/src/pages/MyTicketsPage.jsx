import { useState, useEffect } from 'react';
import EventVisual from '../components/EventVisual';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { getAllEvents } from '../api/eventApi';
import '../styles/ConfirmAndProfile.css';
import '../styles/shared.css';

const MENU_ITEMS = [
  { key: 'upcoming', icon: '🎟', label: 'My Tickets'       },
  { key: 'saved',    icon: '❤️', label: 'Saved Events'     },
  { key: 'settings', icon: '⚙️', label: 'Settings'         },
  { key: 'payments', icon: '💳', label: 'Payments'         },
  { key: 'help',     icon: '◻',  label: 'Help'             },
];

function formatDate(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric',
  });
}

export default function MyTicketsPage({ onNav }) {
  const [tab, setTab]           = useState('upcoming');
  const [tickets, setTickets]   = useState([]);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const { user }                = useAuth();

  // fetch bookings + events on mount
  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    const load = async () => {
      try {
        const [bookingsRes, eventsRes] = await Promise.all([
          getMyBookings(user.id),
          getAllEvents(),
        ]);
        setTickets(bookingsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // helper: look up event details by eventId
  const eventFor = (booking) =>
    events.find(e => e.id === booking.eventId) || {};

  // split into upcoming (CONFIRMED) and past (CANCELLED)
  const upcoming = tickets.filter(t => t.status === 'CONFIRMED');
  const past     = tickets.filter(t => t.status === 'CANCELLED');
  const display  = tab === 'upcoming' ? upcoming : past;

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      setTickets(prev => prev.map(t =>
        t.bookingId === bookingId ? { ...t, status: 'CANCELLED' } : t
      ));
    } catch (err) {
      alert('Could not cancel booking.');
    }
  };

  // derive initials + name from JWT user
  const firstName = user?.firstName || user?.sub || '';
  const lastName  = user?.lastName  || '';
  const initials  = (firstName[0] || '') + (lastName[0] || '');
  const fullName  = [firstName, lastName].filter(Boolean).join(' ');
  const email     = user?.email || user?.sub || '';

  return (
    <div className="profile-layout">

      {/* ── SIDEBAR ── */}
      <div className="profile-sidebar">
        <div className="profile-avatar">{initials.toUpperCase()}</div>
        <div className="profile-name">{fullName}</div>
        <div className="profile-email">{email}</div>

        {MENU_ITEMS.map(m => (
          <div
            key={m.key}
            className={`profile-menu-item ${tab === m.key ? 'active' : ''}`}
            onClick={() => setTab(m.key)}
          >
            <span className="pmi-icon">{m.icon}</span>
            <span className="pmi-text">{m.label}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN ── */}
      <div className="profile-main">

        {/* Stats */}
        <div className="profile-stats">
          <div className="p-stat"><div className="p-stat-val">{upcoming.length + past.length}</div><div className="p-stat-label">Total bookings</div></div>
          <div className="p-stat"><div className="p-stat-val">{upcoming.length}</div><div className="p-stat-label">Upcoming</div></div>
          <div className="p-stat"><div className="p-stat-val">{past.length}</div><div className="p-stat-label">Cancelled</div></div>
          <div className="p-stat">
            <div className="p-stat-val">₹{upcoming.reduce((s, t) => s + (t.totalAmount || 0), 0).toLocaleString('en-IN')}</div>
            <div className="p-stat-label">Total spent</div>
          </div>
        </div>

        {/* Header + tab toggle */}
        <div className="section-top" style={{ marginBottom: 28 }}>
          <h2 className="section-h2">My <em>Tickets</em></h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`chip ${tab === 'upcoming' ? 'on' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
            <button className={`chip ${tab === 'past'     ? 'on' : ''}`} onClick={() => setTab('past')}>Cancelled ({past.length})</button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            Loading your tickets…
          </div>
        )}

        {/* Empty state */}
        {!loading && display.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: 'var(--muted)', fontSize: 14,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎫</div>
            {tab === 'upcoming'
              ? 'No upcoming tickets. Book an event to see your tickets here!'
              : 'No cancelled bookings.'}
            {tab === 'upcoming' && (
              <div style={{ marginTop: 20 }}>
                <button className="btn-large" onClick={() => onNav('explore')}>
                  Browse Events →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ticket grid */}
        {!loading && display.length > 0 && (
          <div className="my-tickets-grid">
            {display.map((t, i) => {
              const ev = eventFor(t);
              return (
                <div
                  className="my-ticket-card"
                  key={t.bookingId}
                  style={{ opacity: tab === 'past' ? 0.65 : 1 }}
                >
                  <div className="mtc-thumb">
                    <EventVisual idx={i} />
                  </div>
                  <div className="mtc-body">
                    <div className="mtc-name">{ev.name || `Event #${t.eventId}`}</div>
                    <div className="mtc-meta">
                      {formatDate(ev.eventTime || t.bookingTime)}
                      {ev.location ? ` · ${ev.location}` : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <span className={`badge ${t.status === 'CONFIRMED' ? 'badge-dark' : 'badge-outline'}`}>
                        {t.status === 'CONFIRMED' ? 'Upcoming' : 'Cancelled'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {t.quantity} ticket{t.quantity > 1 ? 's' : ''} · ₹{t.totalAmount}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                      Booking #{t.bookingId}
                    </div>
                    {t.status === 'CONFIRMED' && (
                      <button
                        className="btn-large-ghost"
                        style={{ marginTop: 10, fontSize: 12, padding: '6px 14px' }}
                        onClick={(e) => { e.stopPropagation(); handleCancel(t.bookingId); }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
