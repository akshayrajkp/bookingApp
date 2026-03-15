import EventVisual from './EventVisual';
import '../styles/EventCard.css';

export default function EventCard({ event, idx, onNav }) {
  return (
    <div className="ecard" onClick={() => onNav('detail', event)}>
      <div className="ecard-thumb">
        <EventVisual idx={idx} />
      </div>
      <div className="ecard-body">
        <div className="ecard-cat">{event.date} · {event.category}</div>
        <div className="ecard-name">{event.name}</div>
        <div className="ecard-venue">{event.venue}</div>
        <div className="ecard-footer">
          <div>
            <div className="ecard-price">{event.price}</div>
            <div className="ecard-seats">{event.seats} seats left</div>
          </div>
          <button className="ecard-btn" onClick={e => { e.stopPropagation(); onNav('detail', event); }}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
