import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/DhartiSlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#e2641e'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'

const HEAD = { left: 10, top: 8, right: 840, height: 112 }
const LOGO_W = 118
const RIGHT_W = 136
const BOX = { left: 10, top: 126, width: 830, height: 218 }

const lbl = { position: 'absolute', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 13.5, fontFamily: SANS, color: VAL, whiteSpace: 'nowrap', lineHeight: 1.15 }
const wLbl = { ...lbl }
const wVal = { ...val }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see DhartiSlip.jsx — the Bold face crashes
// fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 11.5, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }
const lat = { fontSize: 12, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }
const bullet = { width: 6, height: 6, backgroundColor: INK, marginRight: 7, flexShrink: 0 }
const sig = { position: 'absolute', fontSize: 13, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }

// Wire-frame globe — must stay identical to slips/DhartiSlip.jsx
const GLOBE = 104
const G_CX = 52
const G_CY = 52
const G_R = 49
// Narrow, inset clear band so the sphere outline stays continuous either side
const BAND_T = 36
const BAND_B = 68
const BAND_INSET = 7

function GlobeLogo() {
  const mer = (rx) => (
    <ellipse cx={G_CX} cy={G_CY} rx={rx} ry={G_R} stroke={INK} strokeWidth={1.5} fill="none" />
  )
  return (
    <svg viewBox={`0 0 ${GLOBE} ${GLOBE}`} width={GLOBE} height={GLOBE}>
      <circle cx={G_CX} cy={G_CY} r={G_R} stroke={INK} strokeWidth={2.2} fill="none" />
      {mer(16)}
      {mer(33)}
      <path d={`M${G_CX} ${G_CY - G_R} V${G_CY + G_R}`} stroke={INK} strokeWidth={1.5} />
      <path d={`M12 ${BAND_T - 10} H92`} stroke={INK} strokeWidth={1.5} />
      <path d={`M12 ${BAND_B + 10} H92`} stroke={INK} strokeWidth={1.5} />
      <path d={`M3 ${G_CY} H${BAND_INSET + 4}`} stroke={INK} strokeWidth={1.5} />
      <path d={`M${GLOBE - BAND_INSET - 4} ${G_CY} H101`} stroke={INK} strokeWidth={1.5} />
    </svg>
  )
}

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

function NettBarIcon() {
  return (
    <svg viewBox="0 0 34 14" width={34} height={14}>
      <rect x={0} y={1} width={34} height={12} fill={INK} />
    </svg>
  )
}

const ROW = { gross: 96, tare: 138, net: 180 }
const COL = {
  icon: 12, label: 72, value: 200, kg: 404, date: 452, dateVal: 520,
  time: 688, timeVal: 748, charges: 560, chargesVal: 686,
}

function WeighRow({ y, icon, label, value, kg, date, dateVal, time, timeVal }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 14 }}>{icon}</div>
      <span style={{ ...wLbl, left: COL.label, top: y - 7 }}>{label}</span>
      <span style={{ ...wVal, left: COL.value, top: y - 7 }}>{value}</span>
      {kg && <span style={{ ...wLbl, left: COL.kg, top: y - 7 }}>KG.</span>}
      {date && <span style={{ ...wLbl, left: COL.date, top: y - 7 }}>DATE :</span>}
      {date && <span style={{ ...wVal, left: COL.dateVal, top: y - 7 }}>{dateVal}</span>}
      {time && <span style={{ ...wLbl, left: COL.time, top: y - 7 }}>TIME :</span>}
      {time && <span style={{ ...wVal, left: COL.timeVal, top: y - 7 }}>{timeVal}</span>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

const NOTE_LINES = [
  { guj: 'કાંટાં ઉપરથી ચાલ્યા બાદ અમારી કોઇપણ જાતની જવાબદારી રહેતી નથી.' },
  { guj: 'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.' },
  { guj: 'ચોવીસ કલાક પહેલા તોલ થયેલી ટ્રક / લારીનો વજન બાદ કરી આપવામાં આવશે નહીં.' },
  { lat: 'MANUAL TARE WEIGH ', guj: 'માટે વે-બ્રીજ જવાબદાર નથી.' },
  { lat: 'SUBJECT TO RAJKOT JURISDICTION.' },
]

export default function DhartiPreview({ data }) {
  const centreW = HEAD.right - HEAD.left - LOGO_W - RIGHT_W
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)' }}>

        {/* Outer rounded printed border */}
        <div style={{ position: 'absolute', left: 4, top: 4, width: PAGE_W - 8, height: PAGE_H - 8, boxSizing: 'border-box', border: `2.5px solid ${INK}`, borderRadius: 10 }} />

        {/* Globe logo; Gujarati name in a clear band across the equator */}
        <div style={{ position: 'absolute', left: HEAD.left + 6, top: HEAD.top + 4 }}>
          <GlobeLogo />
          <div style={{
            position: 'absolute', left: BAND_INSET, top: BAND_T,
            width: GLOBE - 2 * BAND_INSET, height: BAND_B - BAND_T,
            backgroundColor: PAPER, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontFamily: GUJ, color: INK, lineHeight: 1.1 }}>ધરતી</div>
            <div style={{ fontSize: 13, fontFamily: GUJ, color: INK, lineHeight: 1.1, marginTop: 0.5 }}>વે-બ્રીજ</div>
          </div>
        </div>

        {/* Centre header column */}
        <div style={{ position: 'absolute', left: HEAD.left + LOGO_W, top: HEAD.top + 2, width: centreW }}>
          <div style={{ backgroundColor: INK, padding: '2.5px 10px' }}>
            <div style={{ fontSize: 33, fontWeight: 700, fontFamily: SERIF, color: '#fff', textAlign: 'center', letterSpacing: 1.2, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
              DHARTI WEIGH BRIDGE
            </div>
          </div>
          <div style={{ fontSize: 17.5, fontWeight: 700, fontFamily: SANS, color: INK, textAlign: 'center', letterSpacing: -0.2, marginTop: 4, whiteSpace: 'nowrap' }}>
            FULLY ELECTRONIC COMPUTERISED WEIGH-BRIDGE
          </div>
          <div style={{ fontSize: 13, fontFamily: SANS, color: INK, textAlign: 'center', marginTop: 5, whiteSpace: 'nowrap' }}>
            80, Feet Naheru nagar Main Road, (ATIKA)
          </div>
          <div style={{ fontSize: 13, fontFamily: SANS, color: INK, textAlign: 'center', marginTop: 3, whiteSpace: 'nowrap' }}>
            Dhebar Road, South, RAJKOT - 360 002. Mo. : 98250 26841
          </div>
        </div>

        {/* Right block */}
        <div style={{
          position: 'absolute', left: HEAD.right - RIGHT_W, top: HEAD.top,
          width: RIGHT_W, height: HEAD.height, boxSizing: 'border-box',
          border: `2.2px solid ${INK}`, borderRadius: 4,
          padding: '3px 4px 4px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
        }}>
          <div style={{ fontSize: 37, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1.1 }}>50/5</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1.25 }}>METRIC TONS</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1.25 }}>COMPUTERISED</div>
          <div style={{ backgroundColor: INK, width: '100%', padding: '2px 0', marginTop: 4, textAlign: 'center' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1.25 }}>24 HOURS</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1.25 }}>SERVICE</div>
          </div>
        </div>

        {/* Fields box */}
        <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height, boxSizing: 'border-box', border: `2.5px solid ${INK}`, borderRadius: 6 }}>
          <span style={{ ...lbl, left: 14, top: 14 }}>RST No.</span>
          <span style={{ ...lbl, left: 14, top: 38 }}>MATERIAL</span>
          <span style={{ ...lbl, left: 540, top: 14 }}>VEHICLE No. :</span>
          <span style={{ ...lbl, left: 540, top: 38 }}>RECEIVER :</span>

          <span style={{ ...val, left: 152, top: 14 }}>{data.serialNo}</span>
          <span style={{ ...val, left: 152, top: 38 }}>{data.material}</span>
          <span style={{ ...val, left: 662, top: 14 }}>{data.vehicleNo}</span>
          <span style={{ ...val, left: 662, top: 38 }}>{data.party}</span>

          <WeighRow y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" value={data.gross}
            kg date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} />
          <WeighRow y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" value={data.tare}
            kg date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} />
          <WeighRow y={ROW.net} icon={<NettBarIcon />} label="NETT :" value={data.net} kg />

          {/* Charges shares the NETT row, as on the printed slip */}
          <span style={{ ...wLbl, left: COL.charges, top: ROW.net - 7 }}>Charges(Rs) :</span>
          <span style={{ ...wVal, left: COL.chargesVal, top: ROW.net - 7 }}>{data.charges}</span>
        </div>

        {/* Notes */}
        <div style={{ ...noteRow, left: 14, top: 350 }}>
          <span style={{ ...guj, fontSize: 12, marginRight: 4 }}>સુચના :</span>
          <span style={bullet} />
          <span style={guj}>વજન કરતી વખતે બન્ને પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</span>
        </div>
        {NOTE_LINES.map((line, i) => (
          <div key={i} style={{ ...noteRow, left: 86, top: 368 + i * 16 }}>
            <span style={bullet} />
            {line.lat && <span style={{ ...lat, whiteSpace: 'pre' }}>{line.lat}</span>}
            {line.guj && <span style={guj}>{line.guj}</span>}
          </div>
        ))}

        <span style={{ ...sig, left: 672, top: 433 }}>Operator Signature</span>

      </div>
    </SlipScaler>
  )
}
