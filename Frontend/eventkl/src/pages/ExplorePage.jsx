import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { getAllEvents } from '../api/eventApi';
import '../styles/HomePage.css';
import '../styles/shared.css';

const CATEGORIES = ['All', 'Music', 'Talk', 'Theatre', 'Workshop', 'Dance'];

export default function ExplorePage({ onNav }) {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    getAllEvents()
      .then(res => setEvents(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => {
    const matchCat    = filter === 'All' || e.category === filter;
    const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase())
                     || e.venue?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <section className="section section-alt" style={{ paddingBottom: 28 }}>
        <h2 className="section-h2" style={{ marginBottom: 8 }}>All <em>Events</em></h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
          {loading ? 'Loading…' : `Showing ${filtered.length} events`}
        </p>

        <div className="searchbar" style={{ maxWidth: 700, marginBottom: 24 }}>
          <div className="sb-field">
            <div className="sb-label">Search</div>
            <input
              className="sb-input"
              placeholder="Event, artist, venue…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="sb-field" style={{ borderRight: 'none' }}>
            <div className="sb-label">Location</div>
            <input className="sb-input" placeholder="Any city" />
          </div>
          <button className="sb-btn">Go</button>
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
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        {/* Loading skeleton */}
        {loading && (
          <div className="event-grid three">
            {[...Array(6)].map((_, i) => (
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

        {/* Error */}
        {error && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#c0392b', marginBottom: 16 }}>{error}</p>
            <button className="btn-large-ghost" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 24, marginBottom: 8 }}>
              No events found.
            </p>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Try a different category or search term.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="event-grid three">
            {filtered.map((e, i) => (
              <EventCard key={e.id} event={e} idx={i} onNav={onNav} />
            ))}
          </div>
        )}
      </section>

      <Footer onNav={onNav} />
    </>
  );
}