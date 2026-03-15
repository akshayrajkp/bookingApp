import '../styles/ConfirmAndProfile.css';
import '../styles/shared.css';

export default function ConfirmPage({ data, onNav }) {
  const { event, qty } = data;
  const bookingId = `EVK-${Math.floor(Math.random() * 90000) + 10000}`;

  return (
    <div className="confirm-page">

      {/* ── LEFT — messaging ── */}
      <div className="confirm-left">
        <div className="confirm-icon-wrap">✓</div>
        <h1 className="confirm-h1">
          Booking<br /><em>Confirmed.</em>
        </h1>
        <p className="confirm-sub">
          Your tickets for <strong>{event.name}</strong> have been confirmed.
          A confirmation with your e-tickets has been sent to your email address.
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          <button className="btn-large" onClick={() => onNav('home')}>
            Back to Home
          </button>
          <button className="btn-large-ghost" onClick={() => onNav('mytickets')}>
            View All Tickets
          </button>
        </div>
      </div>

      {/* ── RIGHT — e-ticket ── */}
      <div className="confirm-right">
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          Your E-Ticket
        </div>

        <div className="ticket-card">
          <div className="ticket-head">
            <div className="ticket-head-event">{event.name}</div>
            <div className="ticket-head-date">{event.date}, 2025 · 7:00 PM</div>
          </div>

          <div className="ticket-body-inner">
            <div>
              <div className="ticket-field-label">Venue</div>
              <div className="ticket-field-val">{event.venue}</div>
            </div>
            <div>
              <div className="ticket-field-label">Seats</div>
              <div className="ticket-field-val">{qty} × General</div>
            </div>
            <div>
              <div className="ticket-field-label">Category</div>
              <div className="ticket-field-val">{event.category}</div>
            </div>
            <div>
              <div className="ticket-field-label">Booking ID</div>
              <div className="ticket-field-val">#{bookingId}</div>
            </div>
          </div>

          <div className="ticket-barcode-wrap">
            <div className="barcode" />
            <div className="ticket-scan-label">Scan at entry</div>
          </div>
        </div>
      </div>

    </div>
  );
}
