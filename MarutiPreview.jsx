import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/MarutiSlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#2f9e4f'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const FRAME = { left: 14, top: 10, width: 822, height: 438 }

// Header prints on white; only TON strips + subtitle band are filled green
// — see slips/MarutiSlip.jsx
const HEAD = { left: 28, top: 22, width: 786, height: 88 }

// Each stack is ONE continuous outlined rectangle — see slips/MarutiSlip.jsx
const CAP_W = 94
const CAP_L = HEAD.left + 4
const CAP_R = HEAD.left + HEAD.width - CAP_W - 4
const CAP = { top: 4, height: 84 }
const CAP_NUM_H = 40
const CAP_TON_H = 22

const MID = { left: HEAD.left + CAP_W + 12, width: HEAD.width - 2 * (CAP_W + 12) }
const TITLE_TOP = 2
const SUB = { top: 46, height: 24 }

const ADDR_TOP = 113

const BOX = { left: 28, top: 146, width: 786, height: 152 }
const ROW = { gross: 70, tare: 105, net: 138 }
const COL = {
  icon: 10, label: 56, value: 180, kg: 268, date: 302, dateVal: 380,
  time: 524, timeVal: 612, chargesLbl: 490, chargesVal: 660,
  rLbl: 495, rColon: 600, rVal: 616,
}

const BANNER = { top: 303, height: 34 }
const BANNER_L = { left: BOX.left, width: 392 }
const BANNER_R = { left: BOX.left + 392, width: BOX.width - 392 }

const NOTES_TOP = 345
const NOTES_STEP = 14.5

const lbl = { position: 'absolute', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 15, fontFamily: DOT, color: VAL, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }
// Condensed pitch (17 CPI) — mirrors the matching valNarrow in the PDF
const valNarrow = { ...val, fontSize: 11, letterSpacing: 0.4 }
// the weighing software prints the weight figures enlarged
const wVal = { ...val, fontSize: 19, letterSpacing: 1.5 }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see slips/MarutiSlip.jsx — the Bold face
// crashes fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 11, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }
const bullet = { width: 6, height: 6, backgroundColor: INK, marginRight: 6, flexShrink: 0 }

// Dot-matrix loaded truck (GROSS) — must stay identical to slips/MarutiSlip.jsx
function TruckLoadedIcon() {
  const dots = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 7; c++)
      dots.push(<rect key={`d${r}-${c}`} x={1 + c * 4.2} y={1 + r * 4.2} width={3.1} height={3.1} fill={INK} />)
  return (
    <svg viewBox="0 0 46 30" width={46} height={30}>
      {dots}
      <rect x={0.5} y={17.5} width={33.5} height={4} fill={INK} />
      <rect x={34} y={9} width={9.5} height={12.5} fill={INK} />
      <rect x={35.6} y={10.8} width={4.2} height={4.2} fill={PAPER} />
      <circle cx={7} cy={25.5} r={3} fill={INK} />
      <circle cx={17} cy={25.5} r={3} fill={INK} />
      <circle cx={37.5} cy={25.5} r={3} fill={INK} />
    </svg>
  )
}

function TruckEmptyIcon() {
  return (
    <svg viewBox="0 0 46 30" width={46} height={30}>
      <rect x={0} y={14.5} width={5} height={2} fill={INK} />
      <rect x={5} y={12.5} width={26} height={4.5} fill={INK} />
      <rect x={31} y={5} width={11} height={12} fill={INK} />
      <rect x={32.8} y={7} width={4.6} height={4.6} fill={PAPER} />
      <circle cx={10} cy={21.5} r={3} fill={INK} />
      <circle cx={20} cy={21.5} r={3} fill={INK} />
      <circle cx={36.5} cy={21.5} r={3} fill={INK} />
    </svg>
  )
}

function NettDashesIcon() {
  const segs = []
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++)
      segs.push(<rect key={`s${r}-${c}`} x={c * 13} y={r * 8} width={10} height={5} fill={INK} />)
  return (
    <svg viewBox="0 0 36 13" width={36} height={13}>
      {segs}
    </svg>
  )
}

const centred = { display: 'flex', alignItems: 'center', justifyContent: 'center' }

// Single unbroken outlined rectangle holding three rows: numeral, solid green
// TON band spanning the full inner width, then CAPACITY
function CapacityBlock({ left, num }) {
  return (
    <div style={{
      position: 'absolute', left, top: HEAD.top + CAP.top, width: CAP_W, height: CAP.height,
      boxSizing: 'border-box', border: `2px solid ${INK}`, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ ...centred, height: CAP_NUM_H }}>
        <span style={{ fontSize: 30, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>{num}</span>
      </div>
      <div style={{ ...centred, height: CAP_TON_H, backgroundColor: INK }}>
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1 }}>TON</span>
      </div>
      <div style={{ ...centred, flexGrow: 1 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>CAPACITY</span>
      </div>
    </div>
  )
}


// GROSS / TARE / NET: one right-aligned column ending at 253, starting at
// 118 so a 6-digit weight fits. Mirrors WT in the matching PDF slip.
const WT = { left: 118, width: 135, textAlign: 'right' }

function WeighRow({ y, icon, label, value, date, dateVal, time, timeVal }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 14 }}>{icon}</div>
      <span style={{ ...lbl, left: COL.label, top: y - 7 }}>{label}</span>
      <span style={{ ...wVal, ...WT, top: y - 10 }}>{value}</span>
      <span style={{ ...lbl, left: COL.kg, top: y - 7 }}>Kg.</span>
      {date && <span style={{ ...lbl, left: COL.date, top: y - 7 }}>DATE :</span>}
      {date && <span style={{ ...val, left: COL.dateVal, top: y - 8 }}>{dateVal}</span>}
      {time && <span style={{ ...lbl, left: COL.time, top: y - 7 }}>TIME :</span>}
      {time && <span style={{ ...val, left: COL.timeVal, top: y - 8 }}>{timeVal}</span>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તથા ગાડી નંબર તપાસી લેવા.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
  'વજન કરતી વખતે પાર્ટીએ વજન કાંટા પર શૂન્ય તપાસી, લીધા બાદ ગાડી ચડાવવી.',
  'વજન કરતી વખતે પાર્ટીએ ગાડી માંથી ડ્રાઈવર તથા મજૂરો ઉતરી ગયા બાદ જ વજનની નોંધ લેવી.',
]

export default function MarutiPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)', overflow: 'hidden' }}>

        {/* Thin printed border around the whole slip */}
        <div style={{ position: 'absolute', ...FRAME, boxSizing: 'border-box', border: `2px solid ${INK}` }} />

        {/* ---- Header: green ink on white paper ---- */}
        <div style={{ position: 'absolute', left: MID.left, top: HEAD.top + TITLE_TOP, width: MID.width, textAlign: 'center', fontSize: 36, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          SHREE MARUTI WEIGHBRIDGE
        </div>

        {/* Solid green band carrying the reversed subtitle */}
        <div style={{ position: 'absolute', ...centred, backgroundColor: INK, left: MID.left, top: HEAD.top + SUB.top, width: MID.width, height: SUB.height }}>
          <span style={{ fontSize: 16.5, fontWeight: 700, fontFamily: SANS, color: PAPER, letterSpacing: 0.3, whiteSpace: 'nowrap', lineHeight: 1 }}>
            FULLY COMPUTERISED WEIGHBRIDGE
          </span>
        </div>

        <CapacityBlock left={CAP_L} num="10" />
        <CapacityBlock left={CAP_R} num="100" />

        {/* Address prints on white paper below the panel */}
        <div style={{ position: 'absolute', left: HEAD.left, top: ADDR_TOP, width: HEAD.width, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Maruti Industrial Plot No.-1, Near Maladhari Railway Crossing
        </div>
        <div style={{ position: 'absolute', left: HEAD.left, top: ADDR_TOP + 16, width: HEAD.width, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Before Rolex Bearing, Kothariya, Rajkot
        </div>

        {/* ---- Fields box ---- */}
        <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height, boxSizing: 'border-box', border: `2px solid ${INK}` }}>
          <span style={{ ...lbl, left: 16, top: 7 }}>SERIAL No.</span>
          <span style={{ ...lbl, left: 112, top: 7 }}>:</span>
          <span style={{ ...lbl, left: 16, top: 26 }}>PARTY</span>
          <span style={{ ...lbl, left: 112, top: 26 }}>:</span>
          <span style={{ ...lbl, left: COL.rLbl, top: 15 }}>VEHICLE No.</span>
          <span style={{ ...lbl, left: COL.rColon, top: 15 }}>:</span>
          <span style={{ ...lbl, left: COL.rLbl, top: 36 }}>MATERIAL</span>
          <span style={{ ...lbl, left: COL.rColon, top: 36 }}>:</span>

          <span style={{ ...val, left: 136, top: 6 }}>{data.serialNo}</span>
          <span style={{ ...val, left: 136, top: 25 }}>{data.party}</span>
          <span style={{ ...valNarrow, left: COL.rVal, top: 16 }}>{data.vehicleNo}</span>
          <span style={{ ...val, left: COL.rVal, top: 35 }}>{data.material}</span>

          <WeighRow y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" value={data.gross}
            date dateVal={fmtDate(data.grossDate)} time timeVal={data.grossTime} />
          <WeighRow y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" value={data.tare}
            date dateVal={fmtDate(data.tareDate)} time timeVal={data.tareTime} />
          <WeighRow y={ROW.net} icon={<NettDashesIcon />} label="NETT :" value={data.net} />

          {/* Dot-matrix printed Charges label + amount, as on the real system */}
          {data.charges ? (
            <>
              <span style={{ ...valNarrow, left: COL.chargesLbl, top: ROW.net - 6 }}>Charges(Rs):</span>
              <span style={{ ...valNarrow, left: COL.chargesVal, top: ROW.net - 6 }}>{data.charges}</span>
            </>
          ) : null}
        </div>

        {/* ---- Banner boxes: full-width pair sharing a divider ---- */}
        <div style={{ position: 'absolute', left: BANNER_L.left, top: BANNER.top, width: BANNER_L.width, height: BANNER.height, boxSizing: 'border-box', border: `2.5px solid ${INK}`, borderRightWidth: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: SERIF, color: INK, letterSpacing: 1, whiteSpace: 'nowrap' }}>* GOVERNMENT APPROVED *</span>
        </div>
        <div style={{ position: 'absolute', left: BANNER_R.left, top: BANNER.top, width: BANNER_R.width, height: BANNER.height, boxSizing: 'border-box', border: `2.5px solid ${INK}`, borderLeftWidth: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: SANS, color: INK, letterSpacing: 1, whiteSpace: 'nowrap' }}>* 24 HOURS SERVICE *</span>
        </div>

        {/* ---- Notes ---- */}
        <div style={{ ...noteRow, left: 40, top: NOTES_TOP }}>
          <span style={{ ...guj, fontSize: 12, marginRight: 4 }}>સૂચના:</span>
          <span style={bullet} />
          <span style={guj}>{NOTE_LINES[0]}</span>
        </div>
        {NOTE_LINES.slice(1).map((line, i) => (
          <div key={i} style={{ ...noteRow, left: 66, top: NOTES_TOP + (i + 1) * NOTES_STEP }}>
            <span style={bullet} />
            <span style={guj}>{line}</span>
          </div>
        ))}
        <div style={{ ...noteRow, left: 66, top: NOTES_TOP + 6 * NOTES_STEP - 1 }}>
          <span style={bullet} />
          <span style={{ fontSize: 9.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>Subject to Rajkot Jurisdiction only</span>
        </div>

        <span style={{ position: 'absolute', left: 650, top: 422, fontSize: 17, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Operator's Signature
        </span>

      </div>
    </SlipScaler>
  )
}
