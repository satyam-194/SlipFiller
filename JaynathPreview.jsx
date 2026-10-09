import React from 'react'
import SlipScaler from './SlipScaler.jsx'
import jaynathTitle from './jaynathTitle.js'
import jaynathWatermark from './jaynathWatermark.js'

// Same palette + geometry as JaynathPDF.jsx (1pt = 1px here)
const INK = '#3c5490'
const PAPER = '#f7f6f2'
const TINT = '#d9e0ec'
const VAL = '#55618a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const lbl = { position: 'absolute', fontSize: 13.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }

// Value size is pinned to the label size by the ratio measured off the scan:
// the printed cap height is ~25px against the pre-printed label's ~27px, so a
// value cap is ~0.9 of a label cap. The label is 13.5pt Helvetica Bold (cap
// 0.717em = 9.7px), giving a value cap of ~8.6px; LX310Dot's cap is 1.009em,
// so the size and the cap height are effectively the same number.
//
// Every typed field on the slip is this one size — the printer has a single
// pitch and never changes it mid-form. Earlier revisions set the weights to
// 17pt and the dates to 11pt, which is what made the values tower over the
// labels instead of sitting below them as they do on the original.
const VAL_SIZE = 8.5
// letterSpacing stays 0: LX310Dot is monospaced at one em per cell, so the
// advance is already the printer's character pitch. Adding tracking on top
// stretches the line past the field and desynchronises it from the scan.

// Fake bold. A real printer gets its weight by striking the same line two or
// three times with the carriage shifted a fraction of a dot, so the dots smear
// into each other and the stroke fills in. There is no bold cut of LX310Dot to
// switch to, so we reproduce the double-strike itself: draw the glyphs more
// than once at small offsets and let the overlaps merge.
//
// In the browser that is text-shadow — same glyphs, same metrics, just extra
// copies of the fill. Offsets are in px at the 850px design width, so they
// scale with SlipScaler like everything else. The PDF does the same thing by
// stacking offset <Text> layers (react-pdf has no text-shadow); the offsets
// there are kept identical so screen and paper agree.
//
//   normal  - single strike, the lightest the printer goes
//   strong  - one extra pass right+down, the usual "emphasised" look
//   xstrong - a four-way smear; dots merge almost completely
const BOLD_OFFSETS = {
  normal: [],
  strong: [[0.35, 0], [0, 0.35]],
  xstrong: [[0.45, 0], [0, 0.45], [0.45, 0.45], [0.22, 0.22]],
}
// How hard the values are struck. Measured against the scan: the original's
// strokes are solid bars with no gaps between dots, which a single strike at
// this size does not quite give, so the slip prints 'strong'.
const VAL_BOLD = 'strong'

const fakeBold = (level, color) => {
  const offs = BOLD_OFFSETS[level] || []
  return offs.length ? { textShadow: offs.map(([x, y]) => `${x}px ${y}px 0 ${color}`).join(', ') } : {}
}

const val = { position: 'absolute', fontSize: VAL_SIZE, fontFamily: DOT, color: VAL, whiteSpace: 'nowrap', lineHeight: 1.15, ...fakeBold(VAL_BOLD, VAL) }
const guj = { position: 'absolute', fontSize: 10.5, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }

const fmtDateSlash = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)
const fmtCharges = (c) => (c ? (/[/-]\s*$/.test(c) ? c : `${c}/-`) : '')

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}
// The date/time fields measured the same cap height as every other value on
// the scan, so they are not condensed; this alias is kept only so the call
// sites below keep reading as "the date column".
const valNarrow = val

const DECO = "'Deco', 'Arial Black', sans-serif"
const sideSmall = { fontSize: 8.6, fontWeight: 700, fontFamily: SANS, color: '#fff', textAlign: 'center', lineHeight: 1.25 }

// Solid blue square with thin white keyline inset and white text
// GROSS / TARE / NET: one right-aligned column ending at 425, 15pt before the
// date/charges label column at 440. Mirrors WT in slips/JaynathSlip.jsx.
const WT = { left: 215, width: 210, textAlign: 'right' }

function SideBox({ left, children }) {
  return (
    <div style={{ position: 'absolute', left, top: 24, width: 92, height: 92, backgroundColor: INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 2.5, border: '1.2px solid #ffffff' }} />
      {children}
    </div>
  )
}

export default function JaynathPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)' }}>

        {/* Header strip tint (runs from the top border down to the divider rule) */}
        <div style={{ position: 'absolute', left: 8, top: 20, width: PAGE_W - 16, height: 101, backgroundColor: TINT }} />
        {/* Bottom notes box tint (from the notes rule down to the outer border) */}
        <div style={{ position: 'absolute', left: 8, top: 354, width: PAGE_W - 16, height: 96, backgroundColor: TINT }} />

        {/* Outer border (starts below the blessings strip) */}
        <div style={{ position: 'absolute', left: 8, top: 20, width: PAGE_W - 16, height: PAGE_H - 28, boxSizing: 'border-box', border: `1.5px solid ${INK}` }} />

        {/* Top blessings — outside the border */}
        <span style={{ ...guj, fontSize: 7, left: 150, top: 6 }}>॥ સત્યમેવ જયતે ॥</span>
        <span style={{ ...guj, fontSize: 7, left: 420, top: 6 }}>॥ શ્રી શક્તિ કૃપા ॥</span>
        <span style={{ ...guj, fontSize: 7, left: 690, top: 6 }}>॥ જય માતાજી ॥</span>

        {/* 50 box */}
        <SideBox left={74}>
          <span style={{ fontSize: 42, fontFamily: DECO, color: '#fff', lineHeight: 1 }}>50</span>
          <div style={{ ...sideSmall, marginTop: 3 }}>METRIC TONS</div>
          <div style={sideSmall}>COMPUTERIESD</div>
        </SideBox>

        {/* 24 box */}
        <SideBox left={712}>
          <div style={{ ...sideSmall, fontSize: 10 }}>SERVICE</div>
          <span style={{ fontSize: 38, fontFamily: DECO, color: '#fff', lineHeight: 1 }}>24</span>
          <div style={{ ...sideSmall, fontSize: 10 }}>HOURS</div>
        </SideBox>

        {/* Header center */}
        {/* Header center — fixed positions so browser and PDF match exactly */}
        <img src={jaynathTitle} alt="JAYNATH WEIGH BRIDGE" style={{ position: 'absolute', left: 181, top: 28, width: 520, height: 43.8, display: 'block' }} />
        <div style={{ position: 'absolute', left: 211, top: 75, width: 460, height: 20.5, backgroundColor: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 700, fontFamily: SANS, whiteSpace: 'nowrap', lineHeight: 1 }}>Prop. : Kirti Industries</span>
        </div>
        <div style={{ position: 'absolute', left: 178, top: 101.5, width: 526, fontSize: 13, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1, textAlign: 'center' }}>Gondal Road, Nr. S.T. Work Shop, Rajkot. Mo. 99245 05555, 99243 10061</div>

        <div style={{ position: 'absolute', left: 8, top: 121, width: PAGE_W - 16, height: 1.5, backgroundColor: INK }} />

        {/* Watermark (same lettering as the title) */}
        <img src={jaynathWatermark} alt="" style={{ position: 'absolute', left: 190, top: 181, width: 480, height: 113.4 }} />

        {/* Left column */}
        <span style={{ ...lbl, left: 80, top: 136 }}>Ticket No.</span>
        <span style={{ ...val, left: 215, top: 142 }}>{data.serialNo}</span>
        <span style={{ ...lbl, left: 80, top: 164 }}>Customer Name :</span>
        <span style={{ ...val, left: 230, top: 170 }}>{data.party}</span>
        <span style={{ ...lbl, left: 80, top: 208 }}>Vehicle No.</span>
        <span style={{ ...val, left: 215, top: 214 }}>{data.vehicleNo}</span>
        <span style={{ ...lbl, left: 80, top: 251 }}>Gross WT.</span>
        <span style={{ ...val, ...WT, top: 257 }}>{data.gross}</span>
        <span style={{ ...lbl, left: 80, top: 294 }}>Tare WT.</span>
        <span style={{ ...val, ...WT, top: 300 }}>{data.tare}</span>
        <span style={{ ...lbl, left: 80, top: 337 }}>Net WT.</span>
        <span style={{ ...val, ...WT, top: 343 }}>{data.net}</span>

        {/* Right column */}
        <span style={{ ...lbl, left: 440, top: 152 }}>Supplier Name :</span>
        <span style={{ ...val, left: 585, top: 158 }}>{data.supplierName}</span>
        <span style={{ ...lbl, left: 440, top: 196 }}>Item</span>
        <span style={{ ...lbl, left: 497, top: 196 }}>Name :</span>
        <span style={{ ...val, left: 585, top: 202 }}>{data.material}</span>
        <span style={{ ...lbl, left: 440, top: 240 }}>Gross Date</span>
        <span style={{ ...lbl, left: 548, top: 240 }}>:</span>
        <span style={{ ...valNarrow, left: 575, top: 246 }}>{fmtDateSlash(data.grossDate)}</span>
        <span style={{ ...valNarrow, left: 700, top: 246 }}>{fmtTime(data.grossTime)}</span>
        <span style={{ ...lbl, left: 440, top: 282 }}>Tare Date</span>
        <span style={{ ...lbl, left: 548, top: 282 }}>:</span>
        <span style={{ ...valNarrow, left: 575, top: 288 }}>{fmtDateSlash(data.tareDate)}</span>
        <span style={{ ...valNarrow, left: 700, top: 288 }}>{fmtTime(data.tareTime)}</span>
        <span style={{ ...lbl, left: 440, top: 324 }}>Charges</span>
        <span style={{ ...lbl, left: 548, top: 324 }}>:</span>
        <span style={{ ...val, left: 700, top: 330 }}>{fmtCharges(data.charges)}</span>

        <div style={{ position: 'absolute', left: 8, top: 354, width: PAGE_W - 16, height: 1.5, backgroundColor: INK }} />

        {/* Gujarati notes (inside the bottom box) */}
        <span style={{ ...guj, left: 80, top: 360 }}>(૧) વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</span>
        <span style={{ ...guj, left: 80, top: 379 }}>(૨) વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.</span>
        <span style={{ ...guj, left: 80, top: 398 }}>(૩) ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.</span>

        <span style={{ position: 'absolute', left: 728, top: 398, fontSize: 10.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>Operator's Signature</span>
        <span style={{ position: 'absolute', left: 350, top: 404, fontSize: 14.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>FULLY COMPUTERRISED WEIGH BRIDGE</span>
        <span style={{ position: 'absolute', left: 80, top: 428, fontSize: 11.5, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>Subject to Rajkot Jurisdiction.</span>

      </div>
    </SlipScaler>
  )
}
