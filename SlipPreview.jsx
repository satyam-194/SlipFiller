import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as WeighBridgePDF.jsx (1pt = 1px here)
const INK = '#e13464'
const PAPER = '#fce3f2'
const BOX_BG = '#fdf0f9'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'

const lbl = { position: 'absolute', fontSize: 13, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 13, fontFamily: SANS, color: VAL, whiteSpace: 'nowrap', lineHeight: 1.15 }
const wLbl = { ...lbl, fontSize: 13.5 }
const wVal = { ...val, fontSize: 13.5 }
const bullet = { width: 6.5, height: 6.5, backgroundColor: INK, marginRight: 7, flexShrink: 0 }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
const guj = { fontSize: 10.8, fontFamily: GUJ, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }
const sig = { position: 'absolute', fontSize: 12.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }

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
      <rect x={35.6} y={10.8} width={4.2} height={4.2} fill={BOX_BG} />
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
      <rect x={32.8} y={7} width={4.6} height={4.6} fill={BOX_BG} />
      <circle cx={10} cy={21.5} r={3} fill={INK} />
      <circle cx={20} cy={21.5} r={3} fill={INK} />
      <circle cx={36.5} cy={21.5} r={3} fill={INK} />
    </svg>
  )
}

function NetGridIcon() {
  const dots = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 8; c++)
      dots.push(<rect key={`n${r}-${c}`} x={c * 4.2} y={r * 4.2} width={3.1} height={3.1} fill={INK} />)
  return <svg viewBox="0 0 34 17" width={34} height={17}>{dots}</svg>
}

const ROW = { gross: 112, tare: 155, net: 196 }
const COL = { icon: 10, label: 62, value: 122, kg: 299, date: 341, dateVal: 392, time: 588, timeVal: 638, charges: 500, chargesVal: 610 }

function WeighRow({ y, icon, label, value, kg, date, dateVal, time, timeVal }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 14 }}>{icon}</div>
      <span style={{ ...wLbl, left: COL.label, top: y - 6 }}>{label}</span>
      <span style={{ ...wVal, left: COL.value, top: y - 6 }}>{value}</span>
      {kg && <span style={{ ...wLbl, left: COL.kg, top: y - 6 }}>KG.</span>}
      {date && <span style={{ ...wLbl, left: COL.date, top: y - 6 }}>DATE :</span>}
      {date && <span style={{ ...wVal, left: COL.dateVal, top: y - 6 }}>{dateVal}</span>}
      {time && <span style={{ ...wLbl, left: COL.time, top: y - 6 }}>TIME :</span>}
      {time && <span style={{ ...wVal, left: COL.timeVal, top: y - 6 }}>{timeVal}</span>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD-MM-YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('-') : d)

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

const NOTE_LINES = [
  'વે-બ્રિજ થી નિકળ્યા બાદ વજનમાં થતાં ફેરફાર માટે વે-બ્રિજ જવાબદાર નથી.',
  'કહેવાથી લખાવેલ બારદાન માટે વે-બ્રિજ જવાબદાર નથી.',
  'વાહન નંબર ફેરફાર માટે વે-બ્રિજ જવાબદાર નથી.',
]

function SideBox({ left, num, lines, small }) {
  return (
    <div style={{
      position: 'absolute', left, top: 11, width: 90, height: 103, boxSizing: 'border-box',
      border: `2.8px solid ${INK}`, backgroundColor: PAPER,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 52, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>{num}</span>
      </div>
      <div style={{ backgroundColor: INK, width: '100%', padding: '3.5px 1px', textAlign: 'center' }}>
        {lines.map((l) => (
          <div key={l} style={{ fontSize: small ? 8.6 : 10.5, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1.25 }}>{l}</div>
        ))}
      </div>
    </div>
  )
}

export default function SlipPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)' }}>

        {/* Outer printed border */}
        <div style={{ position: 'absolute', left: 4, top: 4, width: PAGE_W - 22, height: PAGE_H - 8, boxSizing: 'border-box', border: `2.5px solid ${INK}` }} />

        <SideBox left={16} num="24" lines={['HOURS', 'SERVICE']} />
        <SideBox left={730} num="50" lines={['METRIC TONS', 'COMPUTERISED']} small />

        {/* Header center */}
        <div style={{ position: 'absolute', left: 106, top: 8, width: 624, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }}>SHREE JAY AMBIKA WEIGH BRIDGE</div>
          <div style={{ backgroundColor: INK, padding: '3.5px 28px', marginTop: 2 }}>
            <span style={{ color: '#fff', fontSize: 15.5, fontWeight: 700, fontFamily: SANS, letterSpacing: 0.8, whiteSpace: 'pre' }}>FULLY  COMPUTERISED WEIGH-BRIDGE</span>
          </div>
          <div style={{ fontSize: 13.5, fontFamily: SANS, color: INK, marginTop: 4, whiteSpace: 'nowrap' }}>6 - MAVDI PLOT CORNER, MAVDI ROAD, RAJKOT. Mo. : 63547 98792</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: SANS, color: INK, marginTop: 1 }}>(A GOVERNMENT APPROVED)</div>
        </div>

        {/* Fields box */}
        <div style={{ position: 'absolute', left: 14, top: 125, width: PAGE_W - 40, height: 220, boxSizing: 'border-box', border: `2.5px solid ${INK}`, backgroundColor: BOX_BG }}>
          <span style={{ ...lbl, left: 14, top: 20 }}>SERIAL No.:</span>
          <span style={{ ...val, left: 98, top: 20 }}>{data.serialNo}</span>
          <span style={{ ...lbl, left: 526, top: 20 }}>VEHICLE No. :</span>
          <span style={{ ...val, left: 622, top: 20 }}>{data.vehicleNo}</span>

          <span style={{ ...lbl, left: 14, top: 44 }}>PARTY :</span>
          <span style={{ ...val, left: 74, top: 44 }}>{data.party}</span>
          <span style={{ ...lbl, left: 554, top: 44 }}>MATERIAL :</span>
          <span style={{ ...val, left: 634, top: 44 }}>{data.material}</span>

          <WeighRow y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" value={data.gross}
            kg date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} />
          <WeighRow y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" value={data.tare}
            kg date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} />
          <WeighRow y={ROW.net} icon={<NetGridIcon />} label="NET :" value={data.net} kg />

          {/* Charges — sits on the NET row, right-hand side */}
          <span style={{ ...wLbl, left: COL.charges, top: ROW.net - 6 }}>Charges(Rs) :</span>
          <span style={{ ...wVal, left: COL.chargesVal, top: ROW.net - 6 }}>{data.charges}</span>
        </div>

        {/* Notes */}
        <div style={{ ...noteRow, left: 8, top: 352 }}>
          <span style={{ ...guj, fontSize: 11.5, marginRight: 4 }}>સુચના :</span>
          <span style={bullet} />
          <span style={guj}>વજન કરતી વખતે બન્ને પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</span>
        </div>
        {NOTE_LINES.map((line, i) => (
          <div key={i} style={{ ...noteRow, left: 68, top: 374 + i * 20 }}>
            <span style={bullet} />
            <span style={guj}>{line}</span>
          </div>
        ))}
        <div style={{ ...noteRow, left: 68, top: 434 }}>
          <span style={bullet} />
          <span style={{ fontSize: 12, fontFamily: SANS, color: INK }}>Subject to Rajkot Jurisdiction.</span>
        </div>
        <span style={{ ...sig, left: 500, top: 433 }}>Operator Signature</span>
        <span style={{ ...sig, left: 695, top: 433 }}>Driver's Signature</span>

        {/* Printer credit outside the border on the right margin (reads bottom-to-top) */}
        <div style={{ position: 'absolute', left: 760, top: 361, width: 160, height: 10, transformOrigin: 'center', transform: 'rotate(-90deg)', fontSize: 8, lineHeight: '10px', fontFamily: SANS, color: INK, whiteSpace: 'nowrap', textAlign: 'left', letterSpacing: 0.3 }}>
          BALAJI MULTI FORMS - (0281) 2360163
        </div>

      </div>
    </SlipScaler>
  )
}
