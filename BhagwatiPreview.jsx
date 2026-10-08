import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/BhagwatiSlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#d42027'
const BLACK = '#1a1a1a'
const PAPER = '#fdeaea'
const INNER = '#ffffff'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const FRAME = { left: 10, top: 8, width: 830, height: 442 }
const FRAME2 = { left: 20, top: 17, width: 810, height: 424 }

const HEAD_TOP = 26
const BHAG_X = 40
const MARK = { left: 152, top: HEAD_TOP - 2, size: 44 }
const ATI_X = MARK.left + MARK.size - 2
const WEIGH_X = 286
const MATRIX_TOP = HEAD_TOP + 50
const PLOT_TOP = HEAD_TOP + 66
const GOVT_TOP = HEAD_TOP + 88

const ISO = { left: 626, top: HEAD_TOP + 18, width: 104, height: 56 }
const CAP = { left: 740, top: HEAD_TOP - 14, width: 94, height: 100 }
const CAP_NUM_H = 34
const CAP_SUB_H = 13
const CAP_HRS_H = 32

const BOX = { left: 30, top: 140, width: 790, height: 182 }

const L = { label: 14, labelW: 150, value: 180 }
const ROWS = { serial: 10, party: 32 }
const R = { label: 470, labelW: 180, value: 666, vehicle: 32, material: 56 }

const ROW = { gross: 90, tare: 126, net: 158 }
const COL = {
  icon: 12, label: 76, value: 182, kg: 300, date: 356, dateVal: 430,
  time: 578, timeVal: 650, charge: 356,
}
const CHARGES = { label: 440, value: 592 }

const NOTES_LEFT = 34
const NOTES_TOP = 330
const NOTES_STEP = 16

const centred = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
const lblR = { position: 'absolute', fontSize: 14.5, fontWeight: 700, fontFamily: SANS, color: INK, textAlign: 'right', whiteSpace: 'nowrap', lineHeight: 1.15 }
const lbl = { position: 'absolute', fontSize: 14.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 15, fontFamily: DOT, color: VAL, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }
// Condensed pitch (17 CPI) — mirrors the matching valNarrow in the PDF
const valNarrow = { ...val, fontSize: 11, letterSpacing: 0.4 }
const vehicleVal = { ...val, fontSize: 9.5, letterSpacing: 0.2 }
// the weighing software prints the weight figures enlarged
const wVal = { ...val, fontSize: 20, letterSpacing: 1.5 }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see slips/BhagwatiSlip.jsx — the Bold face
// crashes fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 11.5, fontFamily: GUJ, fontWeight: 400, color: BLACK, whiteSpace: 'nowrap' }
const bullet = { width: 6, height: 6, backgroundColor: BLACK, marginRight: 7, flexShrink: 0 }
const sig = { position: 'absolute', fontSize: 13, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }

// The W is reversed out of a solid black roundel
function WordMark() {
  return (
    <div style={{ position: 'absolute', left: MARK.left, top: MARK.top, width: MARK.size, height: MARK.size }}>
      <div style={{ width: MARK.size, height: MARK.size, borderRadius: '50%', backgroundColor: BLACK }} />
      <div style={{
        position: 'absolute', left: 0, top: 6, width: MARK.size, textAlign: 'center',
        fontSize: 30, fontWeight: 700, fontFamily: SERIF, color: PAPER, lineHeight: 1.15,
      }}>W</div>
    </div>
  )
}

function TruckLoadedIcon() {
  const dots = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 5; c++)
      dots.push(<rect key={`d${r}-${c}`} x={2 + c * 4.6} y={3 + r * 4.2} width={3.4} height={3.2} fill={BLACK} />)
  return (
    <svg viewBox="0 0 44 26" width={44} height={26}>
      {dots}
      <rect x={1} y={15.5} width={25} height={3.5} fill={BLACK} />
      <rect x={26} y={8} width={9} height={11} fill={BLACK} />
      <circle cx={7} cy={22} r={2.8} fill={BLACK} />
      <circle cx={16} cy={22} r={2.8} fill={BLACK} />
      <circle cx={30} cy={22} r={2.8} fill={BLACK} />
    </svg>
  )
}

function TruckEmptyIcon() {
  return (
    <svg viewBox="0 0 44 26" width={44} height={26}>
      <rect x={1} y={13} width={25} height={5} fill={BLACK} />
      <rect x={26} y={6} width={10} height={12} fill={BLACK} />
      <circle cx={7} cy={21.5} r={2.8} fill={BLACK} />
      <circle cx={16} cy={21.5} r={2.8} fill={BLACK} />
      <circle cx={31} cy={21.5} r={2.8} fill={BLACK} />
    </svg>
  )
}

function NettSquaresIcon() {
  return (
    <svg viewBox="0 0 44 16" width={44} height={16}>
      <rect x={1} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
      <rect x={15} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
      <rect x={29} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
    </svg>
  )
}

function WeighRowLabels({ y, icon, label, kg, date, time, charge }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 13 }}>{icon}</div>
      <span style={{ ...lbl, left: COL.label, top: y - 8 }}>{label}</span>
      {kg && <span style={{ ...lbl, left: COL.kg, top: y - 8 }}>Kg.</span>}
      {date && <span style={{ ...lbl, left: COL.date, top: y - 8 }}>DATE :</span>}
      {time && <span style={{ ...lbl, left: COL.time, top: y - 8 }}>TIME :</span>}
      {charge && <span style={{ ...lbl, left: COL.charge, top: y - 8 }}>CHARGE :</span>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

const NOTE_LINES = [
  { guj: 'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું' },
  { guj: 'વજન થઇ ગયા પછી અમારી કોઇપણ જાતની જવાબદારી રહેતી નથી.' },
  { guj: 'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.' },
  { guj: 'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.', lat: 'Subject to Rajkot Jurisdiction.' },
  { guj: '“✻” નીશાન મેન્યુઅલ ટેર વેઇટ દશાવિ છે.' },
  { guj: 'મેન્યુઅલ ટેર વેઇટ માટે અમારી કોઇપણ જવાબદારી રહેતી નથી.' },
]

export default function BhagwatiPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)', overflow: 'hidden' }}>

        {/* Double printed border */}
        <div style={{ position: 'absolute', ...FRAME, boxSizing: 'border-box', border: `3px solid ${INK}`, borderRadius: 6 }} />
        <div style={{ position: 'absolute', ...FRAME2, boxSizing: 'border-box', border: `1.5px solid ${INK}`, borderRadius: 10 }} />

        {/* ---- Masthead ---- */}
        <div style={{ position: 'absolute', left: BHAG_X, top: HEAD_TOP - 4, fontSize: 42, fontWeight: 700, fontFamily: SERIF, color: INK, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          BHAG
        </div>
        <WordMark />
        <div style={{ position: 'absolute', left: ATI_X, top: HEAD_TOP - 4, fontSize: 42, fontWeight: 700, fontFamily: SERIF, color: INK, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          ATI
        </div>
        <div style={{ position: 'absolute', left: WEIGH_X, top: HEAD_TOP + 2, fontSize: 34, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          Weigh Bridge
        </div>

        <div style={{ position: 'absolute', left: WEIGH_X, top: MATRIX_TOP, fontSize: 11, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          "MATRIX" MAKE FULLY COMPUTERISED WEIGH BRIDGE
        </div>
        <div style={{ position: 'absolute', left: WEIGH_X, top: PLOT_TOP, fontSize: 10.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          PLOT NO. 188, KUVADVA G.I.D.C., KUVADAVA. M. 92276 62564
        </div>
        <div style={{ position: 'absolute', left: 0, top: GOVT_TOP, width: PAGE_W, textAlign: 'center', fontSize: 17, fontWeight: 700, fontFamily: SANS, color: BLACK, whiteSpace: 'nowrap' }}>
          A GOVERNMENT APPROVED
        </div>

        {/* ISO 9001 CERTIFIED, ruled above and below */}
        <div style={{ position: 'absolute', left: ISO.left, top: ISO.top, width: ISO.width, height: 5, backgroundColor: BLACK }} />
        <div style={{ position: 'absolute', left: ISO.left, top: ISO.top + 9, width: ISO.width, textAlign: 'center', fontSize: 15, fontWeight: 700, fontFamily: SANS, color: BLACK, whiteSpace: 'nowrap' }}>
          ISO : 9001
        </div>
        <div style={{ position: 'absolute', left: ISO.left, top: ISO.top + 27, width: ISO.width, textAlign: 'center', fontSize: 15, fontWeight: 700, fontFamily: SANS, color: BLACK, whiteSpace: 'nowrap' }}>
          CERTIFIED
        </div>
        <div style={{ position: 'absolute', left: ISO.left, top: ISO.top + ISO.height - 5, width: ISO.width, height: 5, backgroundColor: BLACK }} />

        {/* Solid capacity block, top-right */}
        <div style={{ position: 'absolute', ...CAP, backgroundColor: BLACK, display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...centred, height: CAP_NUM_H }}>
            <span style={{ fontSize: 30, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1 }}>100</span>
          </div>
          <div style={{ ...centred, height: CAP_SUB_H }}>
            <span style={{ fontSize: 9, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1 }}>METRIC TONS</span>
          </div>
          <div style={{ ...centred, height: CAP_SUB_H }}>
            <span style={{ fontSize: 9, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1 }}>COMPUTERISED</span>
          </div>
          <div style={{ height: CAP_HRS_H, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>24 HOURS</span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>SERVICE</span>
          </div>
        </div>

        {/* ---- Fields panel ---- */}
        <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height, boxSizing: 'border-box', backgroundColor: INNER, border: `1.5px solid ${INK}`, borderRadius: 10 }}>
          <span style={{ ...lblR, left: L.label, width: L.labelW, top: ROWS.serial }}>SERIAL NO. :</span>
          <span style={{ ...lblR, left: L.label, width: L.labelW, top: ROWS.party }}>PARTY :</span>

          <span style={{ ...lblR, left: R.label, width: R.labelW, top: R.vehicle }}>VEHICLE NO. :</span>
          <span style={{ ...lblR, left: R.label, width: R.labelW, top: R.material }}>MATERIAL :</span>

          <span style={{ ...val, left: L.value, top: ROWS.serial - 1 }}>{data.serialNo}</span>
          <span style={{ ...val, left: L.value, top: ROWS.party - 1 }}>{data.party}</span>
          <span style={{ ...vehicleVal, left: 652, top: R.vehicle + 2 }}>{data.vehicleNo}</span>
          <span style={{ ...val, left: R.value, top: R.material - 1 }}>{data.material}</span>

          <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kg date time />
          <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kg date time />
          <WeighRowLabels y={ROW.net} icon={<NettSquaresIcon />} label="NETT :" kg charge />

          <span style={{ ...wVal, left: COL.value, top: ROW.gross - 11 }}>{data.gross}</span>
          <span style={{ ...valNarrow, left: COL.dateVal, top: ROW.gross - 6 }}>{fmtDate(data.grossDate)}</span>
          <span style={{ ...valNarrow, left: COL.timeVal, top: ROW.gross - 6 }}>{fmtTime(data.grossTime)}</span>

          <span style={{ ...wVal, left: COL.value, top: ROW.tare - 11 }}>{data.tare}</span>
          <span style={{ ...valNarrow, left: COL.dateVal, top: ROW.tare - 6 }}>{fmtDate(data.tareDate)}</span>
          <span style={{ ...valNarrow, left: COL.timeVal, top: ROW.tare - 6 }}>{fmtTime(data.tareTime)}</span>

          <span style={{ ...wVal, left: COL.value, top: ROW.net - 11 }}>{data.net}</span>

          {/* The weighing software prints its own "Charges(Rs):" caption */}
          {data.charges ? (
            <>
              <span style={{ ...valNarrow, left: CHARGES.label, top: ROW.net - 6 }}>Charges(Rs):</span>
              <span style={{ ...valNarrow, left: CHARGES.value, top: ROW.net - 6 }}>{data.charges}</span>
            </>
          ) : null}
        </div>

        {/* ---- Notes ---- */}
        <div style={{ ...noteRow, left: NOTES_LEFT, top: NOTES_TOP }}>
          <span style={{ ...guj, fontSize: 12.5, marginRight: 4 }}>સૂચનાः</span>
          <span style={bullet} />
          <span style={guj}>{NOTE_LINES[0].guj}</span>
        </div>
        {NOTE_LINES.slice(1).map((line, i) => (
          <div key={i} style={{ ...noteRow, left: NOTES_LEFT + 68, top: NOTES_TOP + (i + 1) * NOTES_STEP }}>
            <span style={bullet} />
            <span style={guj}>{line.guj}</span>
            {line.lat && (
              <>
                <span style={{ ...bullet, marginLeft: 10 }} />
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: SANS, color: BLACK, whiteSpace: 'nowrap' }}>{line.lat}</span>
              </>
            )}
          </div>
        ))}

        <span style={{ ...sig, left: 570, top: 398 }}>Operator's Signature</span>
        <span style={{ ...sig, left: 718, top: 398 }}>Driver's Signature</span>

      </div>
    </SlipScaler>
  )
}
