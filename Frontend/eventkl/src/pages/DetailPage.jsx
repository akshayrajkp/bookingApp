import { useState } from 'react';
import '../styles/DetailPage.css';
import '../styles/shared.css';

const SEAT_ROWS = [
  ['A1', 'A2', 'A3', 'A4', 'A5'],
  ['B1', 'B2', 'B3', 'B4', 'B5'],
  ['C1', 'C2', 'C3', 'C4', 'C5'],
];
const TAKEN = ['A2', 'A5', 'B3', 'C1', 'C4'];

export default function DetailPage({ event, onNav }) {
  const [qty, setQty]         = useState(1);
  const [selSeat, setSelSeat] = useState(null);

  const price    = event.price === 'Free' ? 0 : parseInt(event.price.replace('₹', ''));
  const subtotal = price * qty;
  const fee      = Math.round(subtotal * 0.03);
  const total    = subtotal + fee;

  return (
    <div className="detail-layout">

      {/* ── MAIN COLUMN ── */}
      <div className="detail-main">
        <div className="detail-breadcrumb" onClick={() => onNav('home')}>
          ← Events <span>/ {event.name}</span>
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
              background: 'var(--ink)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 55%', opacity: .07,
            }} />
            <div style={{
              position: 'absolute', bottom: -30, right: -20, width: 300, height: 260,
              background: 'var(--ink)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 55%',
            }} />
          </div>
        </div>

        <div className="detail-cat">{event.category}</div>
        <h1 className="detail-h1">{event.name}</h1>

        <div className="detail-info-row">
          <div className="detail-info-item">
            <span className="detail-info-icon">📅</span>
            <span className="detail-info-text">{event.date}, 2025 at 7:00 PM</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-icon">📍</span>
            <span className="detail-info-text">{event.venue}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-icon">🎟</span>
            <span className="detail-info-text">{event.seats} seats remaining</span>
          </div>
        </div>

        <div className="detail-divider" />

        <p className="detail-body-text">
          An extraordinary evening curated for those who appreciate culture at its finest.
          This event brings together Kerala's top artists for a night you will not forget.
          Doors open 30 minutes before the show. Photography is permitted during the first
          15 minutes only. Dress code: smart casual.
        </p>

        <div className="detail-divider" />

        {/* Seat map */}
        <div className="seat-section-title">Choose Your Seat</div>
        <div className="seat-legend">
          <div className="seat-leg-item">
            <div className="seat-dot" style={{ background: 'var(--paper)', border: '1.5px solid var(--border)' }} />
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

        <div className="seat-grid">
          {SEAT_ROWS.map((row, ri) => (
            <div className="seat-row" key={ri}>
              <div className="seat-row-label">{['A', 'B', 'C'][ri]}</div>
              {row.map(s => (
                <button
                  key={s}
                  className={`seat-btn ${TAKEN.includes(s) ? 'taken' : selSeat === s ? 'sel' : ''}`}
                  disabled={TAKEN.includes(s)}
                  onClick={() => setSelSeat(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY SIDE PANEL ── */}
      <div className="detail-side">
        <div className="side-event-label">You're booking</div>
        <div className="side-event-name">{event.name}</div>

        {/* Qty */}
        <div className="qty-label">Tickets</div>
        <div className="qty-ctrl">
          <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span className="qty-num">{qty}</span>
          <button className="qty-btn" onClick={() => setQty(q => Math.min(8, q + 1))}>+</button>
        </div>

        {/* Summary */}
        <div className="side-summary">
          <div className="side-sum-row">
            <span className="side-sum-label">{qty} × {event.price}</span>
            <span className="side-sum-val">₹{subtotal}</span>
          </div>
          <div className="side-sum-row">
            <span className="side-sum-label">Booking fee</span>
            <span className="side-sum-val">₹{fee}</span>
          </div>
          <div className="side-sum-divider" />
          <div className="side-sum-row">
            <span className="side-sum-total-label">Total</span>
            <span className="side-sum-total-val">₹{total}</span>
          </div>
        </div>

        <button className="btn-book" onClick={() => onNav('booking', { event, qty })}>
          Reserve Tickets
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
