import { useState, useEffect } from 'react';
import EventVisual from '../components/EventVisual';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { getAllEvents } from '../api/eventApi';
import '../styles/ConfirmAndProfile.css';
import '../styles/shared.css';

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatTime(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
}

// ── QR code via free API ──────────────────────────────────────────────────────
function QRCode({ value, size = 150 }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  return (
    <img
      src={src}
      alt="Ticket QR Code"
      width={size}
      height={size}
      style={{ borderRadius: 8, display: 'block', border: '1px solid var(--border)' }}
    />
  );
}

// ── ticket detail modal ───────────────────────────────────────────────────────
function TicketModal({ booking, event, onClose, onCancel }) {
  const [cancelling, setCancelling] = useState(false);
  const isCancelled = booking.status === 'CANCELLED';

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await onCancel(booking.bookingId);
      onClose();
    } catch {
      alert('Could not cancel. Please try again.');
      setCancelling(false);
    }
  };

  // QR encodes the key booking info for scanning at venue
  const qrValue = [
    `Booking:${booking.bookingId}`,
    `Event:${booking.eventId}`,
    `User:${booking.userId}`,
    `Seats:${(booking.seats || []).join(',')}`,
    `Status:${booking.status}`,
  ].join('|');

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--paper)',
          borderRadius: 20,
          width: '100%', maxWidth: 540,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── header ── */}
        <div style={{
          background: isCancelled ? '#888' : 'var(--ink)',
          padding: '28px 32px',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 500, letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', marginBottom: 8,
          }}>
            {isCancelled ? 'Cancelled Ticket' : 'E-Ticket · EventKL'}
          </div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 22,
            fontWeight: 700, color: 'var(--paper)', marginBottom: 4,
          }}>
            {event?.name || `Event #${booking.eventId}`}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            {formatDate(event?.eventTime)} · {formatTime(event?.eventTime)}
            {event?.location ? ` · ${event.location}` : ''}
          </div>
        </div>

        {/* ── body ── */}
        <div style={{ padding: '24px 32px' }}>

          {/* fields grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '16px 24px', marginBottom: 24,
          }}>
            {[
              { label: 'Booking ID',   value: `#${booking.bookingId}` },
              { label: 'Status',       value: booking.status },
              { label: 'Seats',        value: (booking.seats || []).join(', ') || '—' },
              { label: 'Quantity',     value: `${booking.quantity} ticket${booking.quantity > 1 ? 's' : ''}` },
              { label: 'Payment',      value: booking.paymentMethod?.toUpperCase() || '—' },
              { label: 'Total Paid',   value: booking.totalAmount ? `₹${booking.totalAmount}` : '—' },
              { label: 'Booked On',    value: formatDate(booking.bookingTime) },
              { label: 'Event ID',     value: `#${booking.eventId}` },
            ].map(f => (
              <div key={f.label}>
                <div style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: 1,
                  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4,
                }}>
                  {f.label}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 500, color: 'var(--ink)',
                }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          {/* dashed divider */}
          <div style={{ borderTop: '1.5px dashed var(--border)', margin: '0 0 24px' }} />

          {/* QR + instructions */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {isCancelled ? (
              <div style={{
                width: 150, height: 150,
                background: 'var(--surface)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13, color: 'var(--muted)',
                textAlign: 'center', padding: 16,
                border: '1px solid var(--border)',
              }}>
                Ticket<br />Cancelled
              </div>
            ) : (
              <QRCode value={qrValue} size={150} />
            )}

            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 15,
                fontWeight: 700, marginBottom: 8, color: 'var(--ink)',
              }}>
                {isCancelled ? 'This ticket is cancelled' : 'Scan at entry'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                {isCancelled
                  ? 'This booking has been cancelled. If you cancelled recently, your seats have been released back to the event.'
                  : 'Show this QR code at the venue entry gate. You can also take a screenshot to use offline.'
                }
              </div>
            </div>
          </div>
        </div>

        {/* ── footer ── */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
          {!isCancelled && (
            <button
              className="btn-ghost"
              style={{ color: '#c0392b', borderColor: '#e8b4b0' }}
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling…' : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── sidebar menu ──────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { key: 'upcoming', icon: '🎟', label: 'My Tickets'   },
  { key: 'past',     icon: '📋', label: 'Past Tickets' },
  { key: 'saved',    icon: '❤️', label: 'Saved Events' },
  { key: 'payments', icon: '💳', label: 'Payments'     },
  { key: 'settings', icon: '⚙️', label: 'Settings'     },
  { key: 'help',     icon: '◻',  label: 'Help'         },
];

// ── page ──────────────────────────────────────────────────────────────────────
export default function MyTicketsPage({ onNav }) {
  const { user } = useAuth();

  const [tab,     setTab]     = useState('upcoming');
  const [tickets, setTickets] = useState([]);
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // currently open ticket

  // derive user info from JWT payload
  const firstName = user?.firstName || user?.name  || '';
  const lastName  = user?.lastName  || '';
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || 'U';
  const fullName  = [firstName, lastName].filter(Boolean).join(' ') || user?.sub || 'User';
  const email     = user?.email || user?.sub || '';

  // ── fetch bookings + events ──
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

  // look up event by id
  const eventFor = (booking) =>
    events.find(e => e.id === booking.eventId) || {};

  // split by status
  const upcoming = tickets.filter(t => t.status === 'CONFIRMED');
  const past     = tickets.filter(t => t.status === 'CANCELLED');
  const display  = tab === 'upcoming' ? upcoming : past;

  const handleCancel = async (bookingId) => {
    await cancelBooking(bookingId);
    setTickets(prev =>
      prev.map(t => t.bookingId === bookingId ? { ...t, status: 'CANCELLED' } : t)
    );
  };

  return (
    <>
      {/* ── ticket modal ── */}
      {selected && (
        <TicketModal
          booking={selected}
          event={eventFor(selected)}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
        />
      )}

      <div className="profile-layout">

        {/* ── SIDEBAR ── */}
        <div className="profile-sidebar">
          <div className="profile-avatar">{initials}</div>
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

          {/* stats */}
          <div className="profile-stats">
            <div className="p-stat">
              <div className="p-stat-val">{tickets.length}</div>
              <div className="p-stat-label">Total bookings</div>
            </div>
            <div className="p-stat">
              <div className="p-stat-val">{upcoming.length}</div>
              <div className="p-stat-label">Upcoming</div>
            </div>
            <div className="p-stat">
              <div className="p-stat-val">{past.length}</div>
              <div className="p-stat-label">Cancelled</div>
            </div>
            <div className="p-stat">
              <div className="p-stat-val">
                ₹{upcoming
                  .reduce((sum, t) => sum + (t.totalAmount || 0), 0)
                  .toLocaleString('en-IN')}
              </div>
              <div className="p-stat-label">Total spent</div>
            </div>
          </div>

          {/* header + tab toggle */}
          <div className="section-top" style={{ marginBottom: 28 }}>
            <h2 className="section-h2">My <em>Tickets</em></h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`chip ${tab === 'upcoming' ? 'on' : ''}`}
                onClick={() => setTab('upcoming')}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                className={`chip ${tab === 'past' ? 'on' : ''}`}
                onClick={() => setTab('past')}
              >
                Cancelled ({past.length})
              </button>
            </div>
          </div>

          {/* loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              Loading your tickets…
            </div>
          )}

          {/* empty state */}
          {!loading && display.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎫</div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, marginBottom: 8 }}>
                No {tab === 'upcoming' ? 'upcoming' : 'cancelled'} tickets.
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
                {tab === 'upcoming'
                  ? 'Book an event and your tickets will appear here.'
                  : 'Cancelled bookings will appear here.'}
              </p>
              {tab === 'upcoming' && (
                <button className="btn-large" onClick={() => onNav('explore')}>
                  Browse Events →
                </button>
              )}
            </div>
          )}

          {/* ticket grid — clicking opens modal */}
          {!loading && display.length > 0 && (
            <div className="my-tickets-grid">
              {display.map((t, i) => {
                const ev = eventFor(t);
                return (
                  <div
                    key={t.bookingId}
                    className="my-ticket-card"
                    style={{ opacity: t.status === 'CANCELLED' ? 0.65 : 1, cursor: 'pointer' }}
                    onClick={() => setSelected(t)}
                  >
                    <div className="mtc-thumb">
                      <EventVisual idx={i} />
                    </div>
                    <div className="mtc-body">
                      <div className="mtc-name">
                        {ev.name || `Event #${t.eventId}`}
                      </div>
                      <div className="mtc-meta">
                        {formatDate(ev.eventTime || t.bookingTime)}
                        {ev.location ? ` · ${ev.location}` : ''}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                        <span className={`badge ${t.status === 'CONFIRMED' ? 'badge-dark' : 'badge-outline'}`}>
                          {t.status === 'CONFIRMED' ? 'Upcoming' : 'Cancelled'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {t.quantity} seat{t.quantity > 1 ? 's' : ''}
                          {t.totalAmount ? ` · ₹${t.totalAmount}` : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                        Booking #{t.bookingId} · Click to view ticket
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}