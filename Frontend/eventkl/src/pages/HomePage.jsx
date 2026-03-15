import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { getAllEvents } from '../api/eventApi';
import '../styles/HomePage.css';
import '../styles/shared.css';

const CATEGORIES = ['All', 'Music', 'Talk', 'Theatre', 'Workshop', 'Dance'];

export default function HomePage({ onNav }) {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');

useEffect(() => {
  getAllEvents()
    .then(res => {
      console.log('Events response:', res.data);  // add this
      setEvents(res.data);
    })
    .catch(err => {
      console.error('Events error:', err);  // add this
      setEvents([]);
    })
    .finally(() => setLoading(false));
}, []);

  const filtered = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

  // first two events used for the featured row
  const featured = events.slice(0, 2);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Kerala's premier event platform</div>
          <h1 className="hero-h1">
            Discover <em>events</em><br />worth attending.
          </h1>
          <p className="hero-p">
            From intimate classical recitals to grand conferences — every event worth
            your evening, curated and bookable in seconds.
          </p>
          <div className="hero-actions">
            <button className="btn-large" onClick={() => onNav('explore')}>Browse Events</button>
            <button className="btn-large-ghost" onClick={() => onNav('mytickets')}>My Tickets</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-hatch" />
          <div className="hero-dots" />
          <div className="hero-blob-ghost" />
          <div className="hero-blob-main" />
          {/* Show first event name in the floating card once loaded */}
          <div className="hero-label-card">
            <div className="hlc-title">
              {loading ? '—' : (events[0]?.name ?? 'Upcoming Event')}
            </div>
            <div className="hlc-sub">
              {loading ? '—' : (events[0]?.venue ?? '')}
            </div>
            {!loading && events[0] && (
              <div className="hlc-tag">Book Now</div>
            )}
          </div>
          <div className="hero-stats">
            <div className="hstat">
              <div className="hstat-val">{loading ? '—' : `${events.length}+`}</div>
              <div className="hstat-label">Events</div>
            </div>
            <div className="hstat">
              <div className="hstat-val">12k+</div>
              <div className="hstat-label">Tickets sold</div>
            </div>
            <div className="hstat">
              <div className="hstat-val">40+</div>
              <div className="hstat-label">Venues</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="searchbar-wrap">
        <div className="searchbar">
          <div className="sb-field">
            <div className="sb-label">Event or Artist</div>
            <input className="sb-input" placeholder="Jazz, TEDx, Theatre…" />
          </div>
          <div className="sb-field">
            <div className="sb-label">Location</div>
            <input className="sb-input" placeholder="Kochi, Trivandrum…" />
          </div>
          <div className="sb-field" style={{ borderRight: 'none' }}>
            <div className="sb-label">Date</div>
            <input className="sb-input" placeholder="Any date" type="date" />
          </div>
          <button className="sb-btn" onClick={() => onNav('explore')}>Search</button>
        </div>
      </div>

      {/* ── FEATURED ── */}
      {!loading && featured.length > 0 && (
        <section className="section section-alt" style={{ padding: 0 }}>
          <div className="featured-row">
            {featured.map((e, i) => (
              <div className="feat-card" key={e.id} onClick={() => onNav('detail', e)}>
                <div className="feat-meta">{e.date} · {e.category}</div>
                <div className="feat-title">
                  {i === 0
                    ? <><em>An Evening of</em><br />{e.name}</>
                    : <>{e.name}<br /><em>Event</em></>
                  }
                </div>
                <div className="feat-sub">
                  {e.description ?? `Kerala's most anticipated ${e.category?.toLowerCase() ?? ''} event. An extraordinary night for connoisseurs.`}
                </div>
                <div className="feat-footer">
                  <span className="feat-tag">Featured</span>
                  <span className="feat-price">
                    From {e.price ? `₹${e.price}` : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EVENT GRID ── */}
      <section className="section">
        <div className="section-top">
          <h2 className="section-h2">All <em>Events</em></h2>
          <span className="section-link" onClick={() => onNav('explore')}>View all →</span>
        </div>

        <div className="filters">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`chip ${filter === c ? 'on' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="event-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="ecard" style={{ opacity: 0.4 }}>
                <div className="ecard-thumb" style={{ background: 'var(--border)' }} />
                <div className="ecard-body">
                  <div style={{ height: 10, background: 'var(--border)', borderRadius: 4, marginBottom: 10, width: '40%' }} />
                  <div style={{ height: 16, background: 'var(--border)', borderRadius: 4, marginBottom: 8, width: '80%' }} />
                  <div style={{ height: 10, background: 'var(--border)', borderRadius: 4, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="event-grid">
            {filtered.slice(0, 4).map((e, i) => (
              <EventCard key={e.id} event={e} idx={i} onNav={onNav} />
            ))}
          </div>
        )}
      </section>

      <Footer onNav={onNav} />
    </>
  );
}