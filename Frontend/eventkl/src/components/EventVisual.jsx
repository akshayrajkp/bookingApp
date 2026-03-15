// Generates the decorative blob + hatch/dot thumbnail for each event card.
// Pass idx = the event's array index so each card gets a distinct composition.

const cfgs = [
  { blob: { w: 120, h: 110, r: 40,  b: -15, op: 1    }, blob2: { w: 80, h: 70, l: 10, t: 10,  op: 0.06 }, hatch: { t: 8,  l: 8,    w: "55%", h: "55%" }, dots: null },
  { blob: { w: 100, h: 90,  l: 20,  t: 20,  op: 1    }, blob2: { w: 70, h: 60, r: 10, b: 10,  op: 0.06 }, hatch: null,                                    dots: { b: 10, r: 10, w: "50%", h: "55%" } },
  { blob: { w: 130, h: 110, r: -20, t: 20,  op: 1    }, blob2: null,                                       hatch: { t: 10, l: 10,   w: "45%", h: "50%" }, dots: { b: 8,  l: 8,  w: "40%", h: "45%" } },
  { blob: { w: 90,  h: 80,  l: "35%", b: 10, op: 1   }, blob2: { w: 60, h: 55, r: 15, t: 15,  op: 0.07 }, hatch: { t: 8,  r: 8,    w: "45%", h: "50%" }, dots: null },
  { blob: { w: 110, h: 100, r: 10,  b: 20,  op: 1    }, blob2: null,                                       hatch: { t: 10, l: 10,   w: "50%", h: "55%" }, dots: { b: 12, r: 40, w: "35%", h: "40%" } },
  { blob: { w: 95,  h: 85,  l: 15,  t: 25,  op: 1    }, blob2: { w: 75, h: 65, r: 5,  b: 5,   op: 0.06 }, hatch: null,                                    dots: { t: 8,  r: 8,  w: "45%", h: "50%" } },
  { blob: { w: 120, h: 105, r: -10, b: -10, op: 1    }, blob2: null,                                       hatch: { t: 12, l: 12,   w: "55%", h: "55%" }, dots: null },
  { blob: { w: 100, h: 90,  l: 10,  b: 20,  op: 1    }, blob2: { w: 65, h: 60, r: 20, t: 10,  op: 0.07 }, hatch: { t: 8,  r: 8,    w: "40%", h: "45%" }, dots: null },
];

export default function EventVisual({ idx }) {
  const c = cfgs[idx % cfgs.length];
  return (
    <div className="ecard-thumb-inner">
      {c.hatch && (
        <div
          className="ehatch"
          style={{ top: c.hatch.t, left: c.hatch.l, right: c.hatch.r, bottom: c.hatch.b, width: c.hatch.w, height: c.hatch.h }}
        />
      )}
      {c.dots && (
        <div
          className="edots"
          style={{ top: c.dots.t, left: c.dots.l, right: c.dots.r, bottom: c.dots.b, width: c.dots.w, height: c.dots.h }}
        />
      )}
      {c.blob2 && (
        <div
          className="eblob"
          style={{ width: c.blob2.w, height: c.blob2.h, left: c.blob2.l, right: c.blob2.r, top: c.blob2.t, bottom: c.blob2.b, opacity: c.blob2.op }}
        />
      )}
      <div
        className="eblob"
        style={{ width: c.blob.w, height: c.blob.h, left: c.blob.l, right: c.blob.r, top: c.blob.t, bottom: c.blob.b, opacity: c.blob.op }}
      />
    </div>
  );
}
