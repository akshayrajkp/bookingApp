import EventVisual from './EventVisual';
import '../styles/EventCard.css';

// Safely reads field names from your Spring Boot Event entity.
// Your entity may use: name, eventName, title  →  we try all three.
// Same for venue, category, price, availableSeats, totalSeats.
function field(event, ...keys) {
  for (const k of keys) {
    if (event[k] !== undefined && event[k] !== null) return event[k];
  }
  return null;
}

export default function EventCard({ event, idx, onNav }) {
  const name     = event.name          ?? 'Untitled Event';
  const category = event.category      ?? '';
  const venue    = event.location      ?? '';
  const date     = event.eventTime     ?? '';
  const price    = event.price         ?? 0;
  const seats    = event.availableSeats;

  const formatDate = (raw) => {
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric',
    });
  };

  const displayDate  = formatDate(date);
  const displayPrice = price === 0 ? 'Free' : `₹${price}`;
  const displaySeats = seats != null ? `${seats} seats left` : '';

  return (
    <div className="ecard" onClick={() => onNav('detail', event)}>
      <div className="ecard-thumb">
        <EventVisual idx={idx} />
      </div>
      <div className="ecard-body">
      <div className="ecard-cat">{category}</div>
      <div className="ecard-name">{name}</div>
      <div className="ecard-venue">
        {displayDate && `${displayDate} · `}{venue}
      </div>
        <div className="ecard-footer">
          <div>
            <div className="ecard-price">{displayPrice}</div>
            {displaySeats && <div className="ecard-seats">{displaySeats}</div>}
          </div>
          <button
            className="ecard-btn"
            onClick={e => { e.stopPropagation(); onNav('detail', event); }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}