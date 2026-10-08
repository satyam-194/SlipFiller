import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/HarikrushnaSlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#1f3864'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const FRAME = { left: 14, top: 10, width: 822, height: 438 }

const HEAD_TOP = 16
const CAP_W = 120
const CAP_H = 122
const CAP_L = FRAME.left + 5
const CAP_R = FRAME.left + FRAME.width - CAP_W - 5

const CAP_NUM_H = 42
const CAP_SUB_H = 16
const CAP_SUB2_H = 16
const CAP_PLAT_H = 15

const MID = { left: CAP_L + CAP_W, width: CAP_R - (CAP_L + CAP_W) }
const TITLE_TOP = HEAD_TOP + 2
const SUB = { top: HEAD_TOP + 48, height: 24 }
const ADDR_TOP = HEAD_TOP + 77
const GOVT_TOP = HEAD_TOP + 95

const BOX = { left: FRAME.left + 5, top: 144, width: FRAME.width - 10, height: 168 }

const L = { label: 26, colon: 124, value: 166 }
const ROWS = { serial: 10, party: 32 }
const R = { label: 490, colon: 588, value: 610, vehicle: 24, material: 48 }

const ROW = { gross: 84, tare: 116, net: 148 }
const COL = {
  icon: 12, label: 66, value: 186, kg: 286, date: 326, dateVal: 414,
  time: 572, timeVal: 656,
}
const CHARGES = { label: 548, value: 690, top: 142 }

const HRS = { left: FRAME.left + 5, top: 320, width: 112, height: 80 }

const NOTES_LEFT = HRS.left + HRS.width + 10
const NOTES_TOP = 322
const NOTES_STEP = 15

const centred = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
const lbl = { position: 'absolute', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 15, fontFamily: DOT, color: VAL, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }
// Condensed pitch (17 CPI) — mirrors the matching valNarrow in the PDF
const valNarrow = { ...val, fontSize: 11, letterSpacing: 0.4 }
// the weighing software prints the weight figures enlarged
const wVal = { ...val, fontSize: 19, letterSpacing: 1.5 }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see slips/HarikrushnaSlip.jsx — the Bold face
// crashes fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 11, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }
const bullet = { width: 5.5, height: 5.5, backgroundColor: INK, marginRight: 6, flexShrink: 0 }
const sig = { position: 'absolute', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }

// Side-view truck outline (GROSS) — must stay identical to the PDF template
function TruckLoadedIcon() {
  return (
    <svg viewBox="0 0 46 26" width={46} height={26}>
      <rect x={1} y={3} width={28} height={14} stroke={INK} strokeWidth={1.6} fill="none" />
      <rect x={29} y={8} width={12} height={9} stroke={INK} strokeWidth={1.6} fill="none" />
      <circle cx={9} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
      <circle cx={34} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
    </svg>
  )
}

function TruckEmptyIcon() {
  return (
    <svg viewBox="0 0 46 26" width={46} height={26}>
      <rect x={1} y={11} width={28} height={6} stroke={INK} strokeWidth={1.6} fill="none" />
      <rect x={29} y={6} width={12} height={11} stroke={INK} strokeWidth={1.6} fill="none" />
      <circle cx={9} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
      <circle cx={34} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
    </svg>
  )
}

function NettBarIcon() {
  const bars = []
  for (let i = 0; i < 9; i++)
    bars.push(<rect key={`b${i}`} x={2.5 + i * 4} y={3} width={1.8} height={8} fill={INK} />)
  return (
    <svg viewBox="0 0 40 14" width={40} height={14}>
      <rect x={0.8} y={0.8} width={38.4} height={12.4} stroke={INK} strokeWidth={1.4} fill="none" />
      {bars}
    </svg>
  )
}

// One continuous outlined rectangle; PLATFORM SIZE strip is reversed
function CapacityBlock({ left, num, size }) {
  return (
    <div style={{
      position: 'absolute', left, top: HEAD_TOP, width: CAP_W, height: CAP_H,
      boxSizing: 'border-box', border: `2px solid ${INK}`, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ ...centred, height: CAP_NUM_H }}>
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>{num}</span>
      </div>
      <div style={{ ...centred, height: CAP_SUB_H }}>
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>METRIC TONS</span>
      </div>
      <div style={{ ...centred, height: CAP_SUB2_H }}>
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>COMPUTERISED</span>
      </div>
      <div style={{ ...centred, height: CAP_PLAT_H, backgroundColor: INK }}>
        <span style={{ fontSize: 9, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1 }}>PLATFORM SIZE</span>
      </div>
      <div style={{ ...centred, flexGrow: 1 }}>
        <span style={{ fontSize: 20, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>{size}</span>
      </div>
    </div>
  )
}

function WeighRow({ y, icon, label, value, date, dateVal, time, timeVal }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 13 }}>{icon}</div>
      <span style={{ ...lbl, left: COL.label, top: y - 7 }}>{label}</span>
      <span style={{ ...wVal, left: COL.value, top: y - 10 }}>{value}</span>
      <span style={{ ...lbl, left: COL.kg, top: y - 7 }}>KG.</span>
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
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
]

export default function HarikrushnaPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)', overflow: 'hidden' }}>

        {/* Thin printed border around the whole slip */}
        <div style={{ position: 'absolute', ...FRAME, boxSizing: 'border-box', border: `2px solid ${INK}` }} />

        {/* ---- Header ---- */}
        <CapacityBlock left={CAP_L} num="100" size="50 X 10" />
        <CapacityBlock left={CAP_R} num="10" size="14 X 7" />

        <div style={{ position: 'absolute', left: MID.left, top: TITLE_TOP, width: MID.width, textAlign: 'center', fontSize: 28, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          HARIKRUSHNA WEIGH BRIDGE
        </div>

        {/* Reversed subtitle band */}
        <div style={{ position: 'absolute', ...centred, backgroundColor: INK, left: MID.left, top: SUB.top, width: MID.width, height: SUB.height }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, fontFamily: SANS, color: PAPER, whiteSpace: 'nowrap', lineHeight: 1 }}>
            FULLY DIGITAL COMPUTERISED WEIGH BRIDGE
          </span>
        </div>

        <div style={{ position: 'absolute', left: MID.left, top: ADDR_TOP, width: MID.width, textAlign: 'center', fontSize: 11, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Near Sanjivani Casting. SIDC Road, Veraval (Shapar), Dist. RAJKOT - 360 024. Mo. 81285 18567.
        </div>
        <div style={{ position: 'absolute', left: MID.left, top: GOVT_TOP, width: MID.width, textAlign: 'center', fontSize: 15, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          A GOVERNMENT APPROVED
        </div>

        {/* ---- Fields box ---- */}
        <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height, boxSizing: 'border-box', border: `2px solid ${INK}` }}>
          <span style={{ ...lbl, left: L.label, top: ROWS.serial }}>SERIAL No. :</span>
          <span style={{ ...lbl, left: L.label, top: ROWS.party }}>PARTY</span>
          <span style={{ ...lbl, left: L.colon, top: ROWS.party }}>:</span>

          <span style={{ ...lbl, left: R.label, top: R.vehicle }}>VEHICLE No. :</span>
          <span style={{ ...lbl, left: R.label, top: R.material }}>MATERIAL :</span>

          <span style={{ ...val, left: L.value, top: ROWS.serial - 1 }}>{data.serialNo}</span>
          <span style={{ ...val, left: L.value, top: ROWS.party - 1 }}>{data.party}</span>
          <span style={{ ...valNarrow, left: R.value, top: R.vehicle + 1 }}>{data.vehicleNo}</span>
          <span style={{ ...val, left: R.value, top: R.material - 1 }}>{data.material}</span>

          <WeighRow y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" value={data.gross}
            date dateVal={fmtDate(data.grossDate)} time timeVal={data.grossTime} />
          <WeighRow y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" value={data.tare}
            date dateVal={fmtDate(data.tareDate)} time timeVal={data.tareTime} />
          <WeighRow y={ROW.net} icon={<NettBarIcon />} label="NETT :" value={data.net} />

          {/* Charges label + amount both print from the weighing software */}
          {data.charges ? (
            <>
              <span style={{ ...valNarrow, left: CHARGES.label, top: CHARGES.top + 2 }}>Charges(Rs) :</span>
              <span style={{ ...valNarrow, left: 700, top: CHARGES.top + 2 }}>{data.charges}</span>
            </>
          ) : null}
        </div>

        {/* ---- 24 HOURS SERVICE block ---- */}
        <div style={{
          position: 'absolute', ...HRS, backgroundColor: INK,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 38, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.1 }}>24</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>HOURS</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>SERVICE</div>
        </div>

        {/* ---- Notes ---- */}
        <div style={{ ...noteRow, left: NOTES_LEFT, top: NOTES_TOP }}>
          <span style={{ ...guj, fontSize: 12, marginRight: 4 }}>સુચના :</span>
          <span style={bullet} />
          <span style={guj}>{NOTE_LINES[0]}</span>
        </div>
        {NOTE_LINES.slice(1).map((line, i) => (
          <div key={i} style={{ ...noteRow, left: NOTES_LEFT + 18, top: NOTES_TOP + (i + 1) * NOTES_STEP }}>
            <span style={bullet} />
            <span style={guj}>{line}</span>
          </div>
        ))}
        <div style={{ ...noteRow, left: NOTES_LEFT + 18, top: NOTES_TOP + 4 * NOTES_STEP }}>
          <span style={bullet} />
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>Subject to Rajkot Jurisdiction</span>
        </div>

        <span style={{ ...sig, left: 560, top: 424 }}>Operator's Signature</span>
        <span style={{ ...sig, left: 706, top: 424 }}>Driver's Signature</span>

      </div>
    </SlipScaler>
  )
}
