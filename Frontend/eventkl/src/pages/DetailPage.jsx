import { useState, useEffect } from 'react';
import '../styles/DetailPage.css';
import ImageSlider from '../components/ImageSlider';
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
  const [selSeats, setSelSeats] = useState([]);

  // ── map API fields from entity ──
  const name = event.name ?? 'Untitled Event';
  const category = event.category ?? '';
  const venue = event.location ?? '';
  const rawTime = event.eventTime ?? '';
  const rawPrice = event.price ?? 0;
  const desc = event.description ?? '';
  const totalSeats = event.totalSeats ?? 0;
  const availableSeats = Array.isArray(event.availableSeats)
    ? event.availableSeats
    : [];

  // ── derived display values ──
  const qty = selSeats.length === 0 ? 1 : selSeats.length;
  const displayDate = formatDate(rawTime);
  const displayTime = formatTime(rawTime);
  const price = Number(rawPrice);
  const displayPrice = price === 0 ? 'Free' : `₹${price}`;
  const subtotal = price * qty;
  const fee = Math.round(subtotal * 0.03);
  const total = subtotal + fee;

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

  // ── seat toggle handler ──
  const toggleSeat = (s) => {
    setSelSeats(prev => {
      // If already selected, remove it
      if (prev.includes(s)) {
        return prev.filter(x => x !== s);
      }
      // Otherwise, add it to selected seats (up to a max of 8 tickets per booking logic)
      if (prev.length < 8) {
        return [...prev, s];
      }
      // If they try to select more than 8, just ignore or alert (ignoring here)
      return prev;
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
          <ImageSlider
            images={
              event.images?.length
                ? event.images
                : event.imageUrl ? [event.imageUrl] : []
            }
            alt={name}
            idx={0}
            height="360px"
          />
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
                    className={`seat-btn ${takenSeats.includes(s) ? 'taken'
                        : selSeats.includes(s) ? 'sel'
                          : ''
                      }`}
                    disabled={takenSeats.includes(s)}
                    onClick={() => toggleSeat(s)}
                    title={
                      takenSeats.includes(s) ? 'Seat taken'
                        : selSeats.includes(s) ? 'Click to deselect'
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
        <div className="qty-label">Tickets Selected</div>
        <div className="qty-ctrl" style={{ justifyContent: 'center', background: 'transparent', border: '1px solid var(--border)' }}>
          <span className="qty-num">{selSeats.length}</span>
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
          style={{ opacity: selSeats.length === 0 ? 0.5 : 1 }}
          disabled={selSeats.length === 0}
          onClick={() => onNav('payment', { event, qty: selSeats.length, seats: selSeats })}
        >
          {selSeats.length === 0
            ? 'Select seats from map'
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