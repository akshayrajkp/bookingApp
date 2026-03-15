import { useState } from 'react';
import EventVisual from '../components/EventVisual';
import '../styles/BookingPage.css';
import '../styles/shared.css';

const STEPS = [
  { n: 1, label: 'Details'  },
  { n: 2, label: 'Payment'  },
];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => (
        <div className="step-item" key={s.n}>
          <div className="step-item-wrap">
            <div className={`step-dot ${current > s.n ? 'done' : current === s.n ? 'cur' : ''}`}>
              {current > s.n ? '✓' : s.n}
            </div>
            <div className="step-label">{s.label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${current > s.n ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingPage({ data, onNav }) {
  const { event, qty } = data;
  const [step, setStep]           = useState(1);
  const [payMethod, setPayMethod] = useState('card');

  const price    = event.price === 'Free' ? 0 : parseInt(event.price.replace('₹', ''));
  const subtotal = price * qty;
  const fee      = Math.round(subtotal * 0.03);
  const total    = subtotal + fee;

  return (
    <div className="booking-layout">

      {/* ── FORM COLUMN ── */}
      <div className="booking-main">
        <StepIndicator current={step} />

        {/* STEP 1 — Details */}
        {step === 1 && (
          <>
            <h2 className="booking-h2">Your details</h2>
            <p className="booking-sub">Fill in your information to secure your seats.</p>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" placeholder="Arjun" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Kumar" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" placeholder="arjun@email.com" type="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="checklist">
              <div className="check-row">
                <div className="check-box-icon">✓</div>
                <div className="check-text">No refunds after 24 hours of booking</div>
              </div>
              <div className="check-row">
                <div className="check-box-icon">✓</div>
                <div className="check-text">Tickets will be sent to your email and phone</div>
              </div>
            </div>

            <div style={{ marginTop: 36 }}>
              <button className="btn-large" onClick={() => setStep(2)}>
                Continue to Payment →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — Payment */}
        {step === 2 && (
          <>
            <h2 className="booking-h2">Payment</h2>
            <p className="booking-sub">Choose your preferred payment method to complete booking.</p>

            <div className="pay-method-row">
              {[
                { key: 'card',       label: 'Credit / Debit' },
                { key: 'upi',        label: 'UPI'            },
                { key: 'netbanking', label: 'Net Banking'     },
                { key: 'wallet',     label: 'Wallet'          },
              ].map(m => (
                <button
                  key={m.key}
                  className={`pay-method-btn ${payMethod === m.key ? 'on' : ''}`}
                  onClick={() => setPayMethod(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="form-grid">
                <div className="form-group full">
                  <label className="form-label">Card Number</label>
                  <div className="card-number-wrap">
                    <input className="form-input" placeholder="1234  5678  9012  3456" />
                    <div className="card-type">VISA</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input className="form-input" placeholder="MM / YY" />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="•••" />
                </div>
                <div className="form-group full">
                  <label className="form-label">Cardholder Name</label>
                  <input className="form-input" placeholder="As on card" />
                </div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div className="form-group" style={{ maxWidth: 400 }}>
                <label className="form-label">UPI ID</label>
                <input className="form-input" placeholder="yourname@upi" />
              </div>
            )}

            {payMethod === 'netbanking' && (
              <div className="form-group" style={{ maxWidth: 400 }}>
                <label className="form-label">Select Bank</label>
                <select className="form-input">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Federal Bank</option>
                </select>
              </div>
            )}

            {payMethod === 'wallet' && (
              <div className="pay-method-row" style={{ maxWidth: 400 }}>
                {['Paytm', 'PhonePe', 'Amazon Pay'].map(w => (
                  <button key={w} className="pay-method-btn">{w}</button>
                ))}
              </div>
            )}

            <div style={{ marginTop: 36, display: 'flex', gap: 14 }}>
              <button className="btn-large-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-large" onClick={() => onNav('confirm', { event, qty })}>
                Pay ₹{total} →
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── ORDER SUMMARY SIDE ── */}
      <div className="booking-side">
        <div className="order-heading">Order Summary</div>

        <div className="order-event-card">
          <div className="oec-thumb">
            <EventVisual idx={0} />
          </div>
          <div className="oec-body">
            <div className="oec-name">{event.name}</div>
            <div className="oec-meta">{event.date} · {event.venue}</div>
          </div>
        </div>

        <div className="price-breakdown">
          <div className="pb-row">
            <span className="pb-label">{qty} ticket{qty > 1 ? 's' : ''} × {event.price}</span>
            <span className="pb-val">₹{subtotal}</span>
          </div>
          <div className="pb-row">
            <span className="pb-label">Booking fee (3%)</span>
            <span className="pb-val">₹{fee}</span>
          </div>
          <div className="pb-row">
            <span className="pb-total-label">Total</span>
            <span className="pb-total-val">₹{total}</span>
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          🔒 Secured by 256-bit SSL encryption. Your payment details are never stored.
        </p>
      </div>

    </div>
  );
}
