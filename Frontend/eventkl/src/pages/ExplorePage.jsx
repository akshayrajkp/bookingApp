import { useState } from 'react';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import events from '../data/events';
import '../styles/HomePage.css';   // reuses searchbar styles
import '../styles/shared.css';

const CATEGORIES = ['All', 'Music', 'Talk', 'Theatre', 'Workshop', 'Dance'];

export default function ExplorePage({ onNav }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <>
      <section className="section section-alt" style={{ paddingBottom: 28 }}>
        <h2 className="section-h2" style={{ marginBottom: 8 }}>All <em>Events</em></h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
          Showing {filtered.length} events in Kerala
        </p>

        <div className="searchbar" style={{ maxWidth: 700, marginBottom: 24 }}>
          <div className="sb-field">
            <div className="sb-label">Search</div>
            <input className="sb-input" placeholder="Event, artist, venue…" />
          </div>
          <div className="sb-field" style={{ borderRight: 'none' }}>
            <div className="sb-label">Location</div>
            <input className="sb-input" placeholder="Any city" />
          </div>
          <button className="sb-btn">Go</button>
        </div>

        <div className="filters">
          {CATEGORIES.map(c => (
            <button key={c} className={`chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="event-grid three">
          {filtered.map((e, i) => (
            <EventCard key={e.id} event={e} idx={i} onNav={onNav} />
          ))}
        </div>
      </section>

      <Footer onNav={onNav} />
    </>
  );
}
