import { useState } from 'react';
import EventVisual from '../components/EventVisual';
import { createBooking } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingPage.css';
import '../styles/shared.css';

function formatDate(raw) {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function PaymentPage({ data, onNav }) {
  const { event, qty, seats = [] } = data;
  const { user } = useAuth();

  const [payMethod, setPayMethod] = useState('card');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [waitlisted, setWaitlisted] = useState(false);

  // card fields
  const [cardNum,  setCardNum]  = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvv,      setCvv]      = useState('');
  const [cardName, setCardName] = useState('');

  // upi fields
  const [upiId, setUpiId] = useState('');

  // ── derived values from event ──
  const name     = event.name      ?? 'Event';
  const venue    = event.location  ?? '';
  const rawTime  = event.eventTime ?? '';
  const price    = Number(event.price ?? 0);
  const subtotal = price * qty;
  const fee      = Math.round(subtotal * 0.03);
  const total    = subtotal + fee;

  // ── card number formatter ──
  const handleCardNum = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    setCardNum(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  // ── expiry formatter MM/YY ──
  const handleExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length >= 3
      ? digits.slice(0, 2) + '/' + digits.slice(2)
      : digits
    );
  };

  // ── card type detector ──
  const cardType = () => {
    const n = cardNum.replace(/\s/g, '');
    if (n.startsWith('4'))  return 'VISA';
    if (n.startsWith('5'))  return 'MC';
    if (n.startsWith('37')) return 'AMEX';
    return '';
  };

  // ── validate fields ──
  const validate = () => {
    if (payMethod === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) return 'Enter a valid 16-digit card number';
      if (expiry.length < 5)  return 'Enter a valid expiry date (MM/YY)';
      if (cvv.length < 3)     return 'Enter a valid CVV';
      if (!cardName.trim())   return 'Enter the cardholder name';
    }
    if (payMethod === 'upi') {
      if (!upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@upi)';
    }
    return null;
  };

  // ── pay handler ──
  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await createBooking({
        userId:        user?.id,
        eventId:       event.id,
        quantity:      qty,
        seats:         seats,
        paymentMethod: payMethod,
        totalAmount:   total,
      });

      // ── handle WAITLISTED response ──
      if (res.data.status === 'WAITLISTED') {
        setWaitlisted(true);
        setLoading(false);
        return;
      }

      // ── handle CONFIRMED response ──
      onNav('confirm', {
        event,
        qty,
        seats,
        bookingId:   res.data.bookingId,
        totalAmount: res.data.totalAmount ?? total,
        status:      res.data.status,
      });

    } catch (err) {
      console.error('Payment error:', err.response?.data);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  // ── WAITLISTED STATE ── shown instead of form when event is full
  if (waitlisted) {
    return (
      <div className="booking-layout">
        <div className="booking-main">
          <div style={{ maxWidth: 480 }}>

            {/* icon */}
            <div style={{
              width: 64, height: 64,
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, marginBottom: 28,
            }}>
              ⏳
            </div>

            <h2 className="booking-h2">You're on the waitlist.</h2>
            <p className="booking-sub">
              This event is currently full. We've added you to the waitlist for{' '}
              <strong>{name}</strong>. If someone cancels, you'll be the first to know.
            </p>

            {/* waitlist info card */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '20px 24px',
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                What happens next
              </div>
              {[
                "We'll notify you by email if a seat becomes available",
                "You'll have 24 hours to confirm your booking",
                "No payment has been taken yet",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 22, height: 22,
                    background: 'var(--ink)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--paper)', fontSize: 11, fontWeight: 700,
                    flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <button className="btn-large" onClick={() => onNav('home')}>
                Back to Home
              </button>
              <button className="btn-large-ghost" onClick={() => onNav('explore')}>
                Browse Other Events
              </button>
            </div>
          </div>
        </div>

        {/* order summary still visible on right */}
        <div className="booking-side">
          <div className="order-heading">Event Details</div>
          <div className="order-event-card">
            <div className="oec-thumb"><EventVisual idx={0} /></div>
            <div className="oec-body">
              <div className="oec-name">{name}</div>
              <div className="oec-meta">
                {formatDate(rawTime)}{venue ? ` · ${venue}` : ''}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginTop: 8 }}>
            You have been added to the waitlist. No charges have been made.
          </div>
        </div>
      </div>
    );
  }

  // ── NORMAL PAYMENT FORM ──
  return (
    <div className="booking-layout">

      {/* ── LEFT — payment form ── */}
      <div className="booking-main">

        {/* back link */}
        <div
          style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 36, cursor: 'pointer' }}
          onClick={() => onNav('detail', event)}
        >
          ← Back to event
        </div>

        <h2 className="booking-h2">Payment</h2>
        <p className="booking-sub">
          Choose your payment method to confirm your booking.
        </p>

        {/* ── METHOD TABS ── */}
        <div className="pay-method-row">
          {[
            { key: 'card', label: 'Credit / Debit Card' },
            { key: 'upi',  label: 'UPI'                 },
          ].map(m => (
            <button
              key={m.key}
              className={`pay-method-btn ${payMethod === m.key ? 'on' : ''}`}
              onClick={() => { setPayMethod(m.key); setError(''); }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── CARD FORM ── */}
        {payMethod === 'card' && (
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Card Number</label>
              <div className="card-number-wrap">
                <input
                  className="form-input"
                  placeholder="1234  5678  9012  3456"
                  value={cardNum}
                  onChange={e => handleCardNum(e.target.value)}
                  maxLength={19}
                />
                {cardType() && (
                  <div className="card-type">{cardType()}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                className="form-input"
                placeholder="MM / YY"
                value={expiry}
                onChange={e => handleExpiry(e.target.value)}
                maxLength={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                className="form-input"
                placeholder="•••"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                type="password"
                maxLength={4}
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Cardholder Name</label>
              <input
                className="form-input"
                placeholder="As on card"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── UPI FORM ── */}
        {payMethod === 'upi' && (
          <div style={{ maxWidth: 400 }}>
            <div className="form-group">
              <label className="form-label">UPI ID</label>
              <input
                className="form-input"
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {['GPay', 'PhonePe', 'Paytm'].map(app => (
                <button
                  key={app}
                  className={`pay-method-btn ${upiId.includes(app.toLowerCase()) ? 'on' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setUpiId(`yourname@${app.toLowerCase()}`)}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div style={{
            fontSize: 13, color: '#c0392b',
            marginTop: 20, padding: '12px 16px',
            background: '#fff8f7', borderRadius: 8,
            borderLeft: '3px solid #c0392b',
          }}>
            {error}
          </div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <div style={{ marginTop: 36, display: 'flex', gap: 14, alignItems: 'center' }}>
          <button
            className="btn-large"
            onClick={handlePay}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, minWidth: 200 }}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  verticalAlign: 'middle',
                  marginRight: 8,
                }} />
                Processing…
              </>
            ) : (
              `Pay ${price === 0 ? 'Free' : `₹${total}`} →`
            )}
          </button>

          <button
            className="btn-large-ghost"
            onClick={() => onNav('detail', event)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
          🔒 Secured by 256-bit SSL encryption. Your payment details are never stored.
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* ── RIGHT — order summary ── */}
      <div className="booking-side">
        <div className="order-heading">Order Summary</div>

        <div className="order-event-card">
          <div className="oec-thumb">
            <EventVisual idx={0} />
          </div>
          <div className="oec-body">
            <div className="oec-name">{name}</div>
            <div className="oec-meta">
              {formatDate(rawTime)}{venue ? ` · ${venue}` : ''}
            </div>
          </div>
        </div>

        <div className="price-breakdown">

          <div className="pb-row">
            <span className="pb-label">{qty} ticket{qty > 1 ? 's' : ''}</span>
            <span className="pb-val">
              {price === 0 ? 'Free' : `${qty} × ₹${price}`}
            </span>
          </div>

          {seats.length > 0 && (
            <div className="pb-row">
              <span className="pb-label">Seats</span>
              <span className="pb-val">{seats.join(', ')}</span>
            </div>
          )}

          <div className="pb-row">
            <span className="pb-label">Subtotal</span>
            <span className="pb-val">
              {price === 0 ? 'Free' : `₹${subtotal}`}
            </span>
          </div>

          <div className="pb-row">
            <span className="pb-label">Booking fee (3%)</span>
            <span className="pb-val">₹{fee}</span>
          </div>

          <div className="pb-row">
            <span className="pb-total-label">Total</span>
            <span className="pb-total-val">
              {price === 0 ? 'Free' : `₹${total}`}
            </span>
          </div>

        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          Free cancellation up to 24 hrs before the event.
        </div>
      </div>

    </div>
  );
}