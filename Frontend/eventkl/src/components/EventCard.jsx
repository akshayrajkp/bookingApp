import ImageSlider from './ImageSlider';
import '../styles/EventCard.css';

export default function EventCard({ event, idx, onNav }) {
  const name     = event.name          ?? 'Untitled Event';
  const category = event.category      ?? '';
  const venue    = event.location      ?? '';
  const date     = event.eventTime     ?? '';
  const price    = event.price         ?? 0;
  const seats    = event.availableSeats;

  // support both single imageUrl and multiple images array
  const images = event.images?.length
    ? event.images
    : event.imageUrl
      ? [event.imageUrl]
      : [];

  const formatDate = (raw) => {
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric',
    });
  };

  const displayDate  = formatDate(date);
  const displayPrice = price === 0 ? 'Free' : `₹${price}`;
  const displaySeats = Array.isArray(seats)
    ? `${seats.length} seats left`
    : seats != null ? `${seats} seats left` : '';

  return (
    <div className="ecard" onClick={() => onNav('detail', event)}>

      {/* image slider — auto-slides every 2s */}
      <div className="ecard-thumb">
        <ImageSlider
          images={images}
          alt={name}
          idx={idx}
          height="180px"
        />
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