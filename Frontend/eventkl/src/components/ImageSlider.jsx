import { useState, useEffect, useRef } from 'react';
import EventVisual from './EventVisual';

export default function ImageSlider({ images = [], alt = '', idx = 0, height = '100%' }) {

  const [current, setCurrent]   = useState(0);
  const [fading,  setFading]    = useState(false);
  const timerRef                = useRef(null);

  // filter out empty/null urls
  const imgs = (images || []).filter(Boolean);

  const goTo = (next) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 300);
  };

  // auto-slide every 2 seconds
  useEffect(() => {
    if (imgs.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % imgs.length;
        setFading(true);
        setTimeout(() => setFading(false), 300);
        return next;
      });
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [imgs.length]);

  // reset on image list change
  useEffect(() => { setCurrent(0); }, [imgs.length]);

  // no images — show decorative blob
  if (imgs.length === 0) {
    return (
      <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
        <EventVisual idx={idx} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>

      {/* image */}
      <img
        src={imgs[current]}
        alt={`${alt} ${current + 1}`}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* dark overlay for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* dot indicators — only if more than 1 image */}
      {imgs.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 5,
        }}>
          {imgs.map((_, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              style={{
                width:  i === current ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* prev / next arrows — only if more than 1 image */}
      {imgs.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo((current - 1 + imgs.length) % imgs.length);
            }}
            style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)', border: 'none',
              color: '#fff', borderRadius: '50%',
              width: 28, height: 28, cursor: 'pointer',
              fontSize: 14, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo((current + 1) % imgs.length);
            }}
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)', border: 'none',
              color: '#fff', borderRadius: '50%',
              width: 28, height: 28, cursor: 'pointer',
              fontSize: 14, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
          >
            ›
          </button>
        </>
      )}

    </div>
  );
}