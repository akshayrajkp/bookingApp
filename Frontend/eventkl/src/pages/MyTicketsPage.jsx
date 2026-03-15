import { useState } from 'react';
import EventVisual from '../components/EventVisual';
import events from '../data/events';
import '../styles/ConfirmAndProfile.css';
import '../styles/shared.css';

const MENU_ITEMS = [
  { key: 'upcoming', icon: '🎟', label: 'My Tickets'       },
  { key: 'saved',    icon: '❤️', label: 'Saved Events'     },
  { key: 'settings', icon: '⚙️', label: 'Settings'         },
  { key: 'payments', icon: '💳', label: 'Payments'         },
  { key: 'help',     icon: '◻',  label: 'Help'             },
];

const PAST_EVENTS = [
  { id: 9,  name: 'Jazz at Sunset',   date: 'Feb 14', venue: 'Marine Drive, Kochi'    },
  { id: 10, name: 'Kochi Biennale',   date: 'Jan 20', venue: 'Aspinwall House, Kochi' },
];

export default function MyTicketsPage({ onNav }) {
  const [tab, setTab] = useState('upcoming');

  const displayEvents = tab === 'upcoming' ? events.slice(0, 3) : PAST_EVENTS;

  return (
    <div className="profile-layout">

      {/* ── SIDEBAR ── */}
      <div className="profile-sidebar">
        <div className="profile-avatar">AK</div>
        <div className="profile-name">Arjun Kumar</div>
        <div className="profile-email">arjun@email.com</div>

        {MENU_ITEMS.map(m => (
          <div
            key={m.key}
            className={`profile-menu-item ${tab === m.key ? 'active' : ''}`}
            onClick={() => setTab(m.key)}
          >
            <span className="pmi-icon">{m.icon}</span>
            <span className="pmi-text">{m.label}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN ── */}
      <div className="profile-main">

        {/* Stats */}
        <div className="profile-stats">
          <div className="p-stat"><div className="p-stat-val">8</div><div className="p-stat-label">Events attended</div></div>
          <div className="p-stat"><div className="p-stat-val">3</div><div className="p-stat-label">Upcoming</div></div>
          <div className="p-stat"><div className="p-stat-val">12</div><div className="p-stat-label">Saved</div></div>
          <div className="p-stat"><div className="p-stat-val">₹3.2k</div><div className="p-stat-label">Total spent</div></div>
        </div>

        {/* Header + tab toggle */}
        <div className="section-top" style={{ marginBottom: 28 }}>
          <h2 className="section-h2">My <em>Tickets</em></h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`chip ${tab === 'upcoming' ? 'on' : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button>
            <button className={`chip ${tab === 'past'     ? 'on' : ''}`} onClick={() => setTab('past')}>Past</button>
          </div>
        </div>

        {/* Ticket grid */}
        <div className="my-tickets-grid">
          {displayEvents.map((e, i) => (
            <div
              className="my-ticket-card"
              key={e.id}
              onClick={() => tab === 'upcoming' && onNav('detail', e)}
              style={{ opacity: tab === 'past' ? 0.65 : 1 }}
            >
              <div className="mtc-thumb">
                <EventVisual idx={i} />
              </div>
              <div className="mtc-body">
                <div className="mtc-name">{e.name}</div>
                <div className="mtc-meta">{e.date} · {e.venue}</div>
                <span className={`badge ${tab === 'upcoming' ? 'badge-dark' : 'badge-outline'}`}>
                  {tab === 'upcoming' ? 'Upcoming' : 'Attended'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
