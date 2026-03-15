import { useState, useEffect } from 'react';
import '../styles/DetailPage.css';
import '../styles/shared.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
}

// ── component ─────────────────────────────────────────────────────────────────

export default function DetailPage({ event, onNav }) {
  const [qty,       setQty]       = useState(1);
  const [selSeats,  setSelSeats]  = useState([]);

  // ── map API fields from entity ──
  const name           = event.name            ?? 'Untitled Event';
  const category       = event.category        ?? '';
  const venue          = event.location        ?? '';
  const rawTime        = event.eventTime       ?? '';
  const rawPrice       = event.price           ?? 0;
  const desc           = event.description     ?? '';
  const totalSeats     = event.totalSeats      ?? 0;
  const availableSeats = Array.isArray(event.availableSeats)
                           ? event.availableSeats
                           : [];

  // ── derived display values ──
  const displayDate  = formatDate(rawTime);
  const displayTime  = formatTime(rawTime);
  const price        = Number(rawPrice);
  const displayPrice = price === 0 ? 'Free' : `₹${price}`;
  const subtotal     = price * qty;
  const fee          = Math.round(subtotal * 0.03);
  const total        = subtotal + fee;

  // ── build seat map ──
  // totalSeats=10 → A1-A5, B1-B5
  const allSeats = Array.from({ length: totalSeats }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 5));
    const col = (i % 5) + 1;
    return `${row}${col}`;
  });

  // a seat is TAKEN if it is NOT in the availableSeats array
  const takenSeats = allSeats.filter(s => !availableSeats.includes(s));

  // group into rows of 5 for display
  const seatRows = [];
  for (let i = 0; i < allSeats.length; i += 5) {
    seatRows.push(allSeats.slice(i, i + 5));
  }

  // trim selected seats if qty is reduced
  useEffect(() => {
    setSelSeats(prev => prev.slice(0, qty));
  }, [qty]);

  // ── seat toggle handler ──
  const toggleSeat = (s) => {
    setSelSeats(prev => {
      if (prev.includes(s)) {
        // deselect
        return prev.filter(x => x !== s);
      }
      if (prev.length < qty) {
        // select if under qty limit
        return [...prev, s];
      }
      // already at limit — swap last selected with new one
      return [...prev.slice(0, -1), s];
    });
  };

  return (
    <div className="detail-layout">

      {/* ── MAIN COLUMN ── */}
      <div className="detail-main">

        <div className="detail-breadcrumb" onClick={() => onNav('home')}>
          ← Events <span>/ {name}</span>
        </div>

        {/* Hero visual */}
        <div className="detail-visual-wide">
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{
              position: 'absolute', top: 30, left: 30, width: 260, height: 200,
              backgroundImage: 'repeating-linear-gradient(-45deg,var(--border) 0,var(--border) .5px,transparent 0,transparent 50%)',
              backgroundSize: '7px 7px', opacity: .7,
            }} />
            <div style={{
              position: 'absolute', bottom: -40, right: -40, width: 380, height: 340,
              background: 'var(--ink)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 55%',
              opacity: .07,
            }} />
            <div style={{
              position: 'absolute', bottom: -30, right: -20, width: 300, height: 260,
              background: 'var(--ink)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 55%',
            }} />
          </div>
        </div>

        {/* Category + title */}
        <div className="detail-cat">{category}</div>
        <h1 className="detail-h1">{name}</h1>

        {/* Info row */}
        <div className="detail-info-row">
          <div className="detail-info-item">
            <span className="detail-info-icon">📅</span>
            <span className="detail-info-text">
              {displayDate}{displayTime ? ` at ${displayTime}` : ''}
            </span>
          </div>
          {venue && (
            <div className="detail-info-item">
              <span className="detail-info-icon">📍</span>
              <span className="detail-info-text">{venue}</span>
            </div>
          )}
          <div className="detail-info-item">
            <span className="detail-info-icon">🎟</span>
            <span className="detail-info-text">
              {availableSeats.length} of {totalSeats} seats remaining
            </span>
          </div>
        </div>

        <div className="detail-divider" />

        {/* Description */}
        <p className="detail-body-text">
          {desc || 'An extraordinary evening curated for those who appreciate culture at its finest. Doors open 30 minutes before the show. Photography is permitted during the first 15 minutes only. Dress code: smart casual.'}
        </p>

        <div className="detail-divider" />

        {/* ── SEAT MAP ── */}
        <div className="seat-section-title">Choose Your Seat</div>

        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          {availableSeats.length} of {totalSeats} seats available
          {qty > 1 && (
            <span style={{ marginLeft: 12, color: 'var(--ink)', fontWeight: 500 }}>
              · Select {qty} seats ({selSeats.length} of {qty} chosen)
            </span>
          )}
        </div>

        <div className="seat-legend">
          <div className="seat-leg-item">
            <div className="seat-dot" style={{
              background: 'var(--paper)', border: '1.5px solid var(--border)',
            }} />
            Available
          </div>
          <div className="seat-leg-item">
            <div className="seat-dot" style={{ background: 'var(--ink)' }} />
            Selected
          </div>
          <div className="seat-leg-item">
            <div className="seat-dot" style={{ background: 'var(--surface)' }} />
            Taken
          </div>
        </div>

        {seatRows.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            No seat data available.
          </p>
        ) : (
          <div className="seat-grid">
            {seatRows.map((row, ri) => (
              <div className="seat-row" key={ri}>
                <div className="seat-row-label">{row[0][0]}</div>
                {row.map(s => (
                  <button
                    key={s}
                    className={`seat-btn ${
                      takenSeats.includes(s)  ? 'taken'
                      : selSeats.includes(s)  ? 'sel'
                      : ''
                    }`}
                    disabled={takenSeats.includes(s)}
                    onClick={() => toggleSeat(s)}
                    title={
                      takenSeats.includes(s)  ? 'Seat taken'
                      : selSeats.includes(s)  ? 'Click to deselect'
                      : selSeats.length >= qty ? `Select ${qty} seats max`
                      : 'Click to select'
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── STICKY SIDE PANEL ── */}
      <div className="detail-side">
        <div className="side-event-label">You're booking</div>
        <div className="side-event-name">{name}</div>

        {/* Qty picker */}
        <div className="qty-label">Tickets</div>
        <div className="qty-ctrl">
          <button
            className="qty-btn"
            onClick={() => setQty(q => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="qty-num">{qty}</span>
          <button
            className="qty-btn"
            onClick={() => setQty(q => Math.min(availableSeats.length || 8, q + 1))}
          >
            +
          </button>
        </div>

        {/* Selected seats indicator */}
        {selSeats.length > 0 && (
          <div style={{
            fontSize: 12, color: 'var(--muted)',
            marginBottom: 14, padding: '10px 14px',
            background: 'var(--surface)', borderRadius: 8,
            lineHeight: 1.7,
          }}>
            Selected seats:{' '}
            <strong style={{ color: 'var(--ink)' }}>
              {selSeats.join(', ')}
            </strong>
          </div>
        )}

        {/* Hint when seats not fully selected */}
        {selSeats.length < qty && (
          <div style={{
            fontSize: 12, color: 'var(--muted)',
            marginBottom: 14, padding: '10px 14px',
            background: 'var(--surface)', borderRadius: 8,
            borderLeft: '3px solid var(--border)',
          }}>
            Please select {qty - selSeats.length} more seat{qty - selSeats.length > 1 ? 's' : ''} from the map
          </div>
        )}

        {/* Price summary */}
        <div className="side-summary">
          <div className="side-sum-row">
            <span className="side-sum-label">{qty} × {displayPrice}</span>
            <span className="side-sum-val">
              {price === 0 ? 'Free' : `₹${subtotal}`}
            </span>
          </div>
          <div className="side-sum-row">
            <span className="side-sum-label">Booking fee (3%)</span>
            <span className="side-sum-val">₹{fee}</span>
          </div>
          <div className="side-sum-divider" />
          <div className="side-sum-row">
            <span className="side-sum-total-label">Total</span>
            <span className="side-sum-total-val">
              {price === 0 ? 'Free' : `₹${total}`}
            </span>
          </div>
        </div>

        <button
          className="btn-book"
          style={{ opacity: selSeats.length < qty ? 0.5 : 1 }}
          disabled={selSeats.length < qty}
          onClick={() => onNav('booking', { event, qty, seats: selSeats })}
        >
          {selSeats.length < qty
            ? `Select ${qty - selSeats.length} more seat${qty - selSeats.length > 1 ? 's' : ''}`
            : 'Reserve Tickets'
          }
        </button>
        <button className="btn-book-ghost">Save for Later</button>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
          Free cancellation up to 24 hrs before the event. Tickets will be emailed
          immediately after booking.
        </p>
      </div>

    </div>
  );
}