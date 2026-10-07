import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/ViratSlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#b5245c'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const FRAME = { left: 12, top: 10, width: 826, height: 440 }

const HEAD_TOP = 22
const CAP_L_W = 98
const CAP_R_W = 118
const CAP_H = 104
const CAP_L = FRAME.left + 14
const CAP_R = FRAME.left + FRAME.width - CAP_R_W - 14

const CAP_NUM_H = 34
const CAP_SUB_H = 14
const CAP_SUB2_H = 14

const MID = { left: CAP_L + CAP_L_W, width: CAP_R - (CAP_L + CAP_L_W) }
const TITLE_TOP = HEAD_TOP - 4
const SUB = { width: 420, top: HEAD_TOP + 48, height: 25 }
const ADDR_TOP = HEAD_TOP + 76

const BOX = { left: FRAME.left + 14, top: 118, width: FRAME.width - 28, height: 196 }

const L = { label: 20, labelW: 150, value: 190 }
const ROWS = { serial: 8, party: 32 }
const R = { label: 470, labelW: 170, value: 650, vehicle: 32, material: 56 }

const ROW = { gross: 88, tare: 128, net: 166 }
const COL = {
  icon: 14, label: 78, value: 190, kg: 300, date: 340, dateVal: 430,
  time: 590, timeVal: 672,
}
const CHARGES = { label: 430, value: 580, top: 158 }

const NOTES_LEFT = FRAME.left + 16
const NOTES_TOP = 324
const NOTES_STEP = 14.5

const GOVT = { left: 360, top: 320, width: 200, height: 20 }

const centred = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
// labels right-align so every colon lines up, as printed
const lblR = { position: 'absolute', fontSize: 15, fontWeight: 700, fontFamily: SANS, color: INK, textAlign: 'right', whiteSpace: 'nowrap', lineHeight: 1.15 }
const lbl = { position: 'absolute', fontSize: 15, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontSize: 15, fontFamily: DOT, color: VAL, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }
// the weighing software prints the weight figures enlarged
const wVal = { ...val, fontSize: 20, letterSpacing: 1.5 }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see slips/ViratSlip.jsx — the Bold face crashes
// fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 10, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }
const bullet = { width: 5, height: 5, backgroundColor: INK, marginRight: 5, flexShrink: 0 }
const sig = { position: 'absolute', fontSize: 12.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }

// Boxed delivery truck with hatched body (GROSS) — identical to the PDF
function TruckLoadedIcon() {
  const lines = []
  for (let i = 0; i < 4; i++)
    lines.push(<rect key={`l${i}`} x={4} y={5 + i * 3.2} width={18} height={1.6} fill={INK} />)
  return (
    <svg viewBox="0 0 48 30" width={48} height={30}>
      <rect x={2} y={2.5} width={22} height={17} stroke={INK} strokeWidth={1.8} fill="none" />
      {lines}
      <rect x={24} y={8} width={14} height={11.5} stroke={INK} strokeWidth={1.8} fill="none" />
      <circle cx={10} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
      <circle cx={31} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
    </svg>
  )
}

function TruckEmptyIcon() {
  return (
    <svg viewBox="0 0 48 30" width={48} height={30}>
      <rect x={2} y={2.5} width={22} height={17} stroke={INK} strokeWidth={1.8} fill="none" />
      <rect x={24} y={8} width={14} height={11.5} stroke={INK} strokeWidth={1.8} fill="none" />
      <circle cx={10} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
      <circle cx={31} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
    </svg>
  )
}

function NetBarsIcon() {
  return (
    <svg viewBox="0 0 44 12" width={44} height={12}>
      <rect x={0} y={2} width={12} height={7} fill={INK} />
      <rect x={15} y={2} width={12} height={7} fill={INK} />
      <rect x={30} y={2} width={12} height={7} fill={INK} />
    </svg>
  )
}

// One continuous outlined rectangle; reversed 24 HOURS / SERVICE at the bottom
function CapacityBlock({ left, width, num }) {
  return (
    <div style={{
      position: 'absolute', left, top: HEAD_TOP, width, height: CAP_H,
      boxSizing: 'border-box', border: `1.8px solid ${INK}`, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ ...centred, height: CAP_NUM_H }}>
        <span style={{ fontSize: 26, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>{num}</span>
      </div>
      <div style={{ ...centred, height: CAP_SUB_H }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>MATRIC TONS</span>
      </div>
      <div style={{ ...centred, height: CAP_SUB2_H }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: SANS, color: INK, lineHeight: 1 }}>COMPUTERISED</span>
      </div>
      <div style={{
        flexGrow: 1, backgroundColor: INK, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>24 HOURS</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, fontFamily: SANS, color: PAPER, lineHeight: 1.2 }}>SERVICE</span>
      </div>
    </div>
  )
}

// kgDy=14 puts "Kg. DATE :" a line below the row label (GROSS/TARE);
// kgDy=0 keeps "Kg. :" on the same line (NET)
function WeighRowLabels({ y, icon, label, kgLabel, kgDy = 14 }) {
  return (
    <>
      <div style={{ position: 'absolute', left: COL.icon, top: y - 15 }}>{icon}</div>
      <span style={{ ...lbl, left: COL.label, top: y - 8 }}>{label}</span>
      <span style={{ ...lbl, left: COL.kg, top: y - 8 + kgDy }}>{kgLabel}</span>
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
]

export default function ViratPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)', overflow: 'hidden' }}>

        {/* Rounded printed border around the whole slip */}
        <div style={{ position: 'absolute', ...FRAME, boxSizing: 'border-box', border: `2px solid ${INK}`, borderRadius: 10 }} />

        {/* ---- Header ---- */}
        <CapacityBlock left={CAP_L} width={CAP_L_W} num="5" />
        <CapacityBlock left={CAP_R} width={CAP_R_W} num="100" />

        <div style={{ position: 'absolute', left: MID.left, top: TITLE_TOP, width: MID.width, textAlign: 'center', fontSize: 40, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
          VIRAT WEIGH-BRIDGE
        </div>

        {/* Reversed subtitle pill */}
        <div style={{
          position: 'absolute', ...centred, backgroundColor: INK, borderRadius: 4,
          left: MID.left + (MID.width - SUB.width) / 2, top: SUB.top, width: SUB.width, height: SUB.height,
        }}>
          <span style={{ fontSize: 15.5, fontWeight: 700, fontFamily: SANS, color: PAPER, whiteSpace: 'nowrap', lineHeight: 1 }}>
            FULLY COMPUTERISED WEIGH BRIDGE
          </span>
        </div>

        <div style={{ position: 'absolute', left: MID.left, top: ADDR_TOP, width: MID.width, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          NR. JITHRIYA HANUMAN TEMPLES, MAVDI MAIN ROAD, RAJKOT-4.
        </div>

        {/* ---- Fields box ---- */}
        <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height, boxSizing: 'border-box', border: `2px solid ${INK}`, borderRadius: 10 }}>
          <span style={{ ...lblR, left: L.label, width: L.labelW, top: ROWS.serial }}>SERIAL NO.:</span>
          <span style={{ ...lblR, left: L.label, width: L.labelW, top: ROWS.party }}>PARTY :</span>

          <span style={{ ...lblR, left: R.label, width: R.labelW, top: R.vehicle }}>VEHICLE NO. :</span>
          <span style={{ ...lblR, left: R.label, width: R.labelW, top: R.material }}>MATERIAL :</span>

          <span style={{ ...val, left: L.value, top: ROWS.serial - 1 }}>{data.serialNo}</span>
          <span style={{ ...val, left: L.value, top: ROWS.party - 1 }}>{data.party}</span>
          <span style={{ ...val, left: R.value, top: R.vehicle - 1 }}>{data.vehicleNo}</span>
          <span style={{ ...val, left: R.value, top: R.material - 1 }}>{data.material}</span>

          <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kgLabel="Kg. DATE :" />
          <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kgLabel="Kg. DATE :" />
          <WeighRowLabels y={ROW.net} icon={<NetBarsIcon />} label="NET :" kgLabel="Kg. :" kgDy={0} />

          <span style={{ ...lbl, left: COL.time, top: ROW.gross + 6 }}>TIME :</span>
          <span style={{ ...lbl, left: COL.time, top: ROW.tare + 6 }}>TIME :</span>

          {/* Weight figures print above their row's label line */}
          <span style={{ ...wVal, left: COL.value, top: ROW.gross - 30 }}>{data.gross}</span>
          <span style={{ ...val, left: COL.dateVal, top: ROW.gross - 14 }}>{fmtDate(data.grossDate)}</span>
          <span style={{ ...val, left: COL.timeVal, top: ROW.gross + 2 }}>{data.grossTime}</span>

          <span style={{ ...wVal, left: COL.value, top: ROW.tare - 12 }}>{data.tare}</span>
          <span style={{ ...val, left: COL.dateVal, top: ROW.tare + 6 }}>{fmtDate(data.tareDate)}</span>
          <span style={{ ...val, left: COL.timeVal, top: ROW.tare + 6 }}>{data.tareTime}</span>

          <span style={{ ...wVal, left: COL.value, top: ROW.net - 11 }}>{data.net}</span>

          {/* CHARGES label + amount both print from the weighing software */}
          {data.charges ? (
            <>
              <span style={{ ...val, left: CHARGES.label, top: CHARGES.top }}>CHARGES (Rs.) :</span>
              <span style={{ ...val, left: CHARGES.value, top: CHARGES.top }}>{data.charges}/-</span>
            </>
          ) : null}
        </div>

        {/* ---- Notes ---- */}
        <div style={{ ...noteRow, left: NOTES_LEFT, top: NOTES_TOP }}>
          <span style={{ ...guj, fontSize: 11, marginRight: 4 }}>સુચના :</span>
          <span style={guj}>✻ ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.</span>
        </div>
        {NOTE_LINES.map((line, i) => (
          <div key={i} style={{ ...noteRow, left: NOTES_LEFT, top: NOTES_TOP + (i + 1) * NOTES_STEP }}>
            <span style={bullet} />
            <span style={guj}>{line}</span>
          </div>
        ))}
        <div style={{ ...noteRow, left: NOTES_LEFT, top: NOTES_TOP + 4 * NOTES_STEP }}>
          <span style={bullet} />
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>Subject to Rajkot Jurisdiction.</span>
        </div>

        {/* Reversed "A Government Approved" pill */}
        <div style={{ position: 'absolute', ...GOVT, ...centred, backgroundColor: INK, borderRadius: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: SANS, color: PAPER, whiteSpace: 'nowrap', lineHeight: 1 }}>
            A Government Approved
          </span>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 404, width: PAGE_W, textAlign: 'center', fontSize: 18, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          THANKS FOR VISIT
        </div>
        <span style={{ ...sig, left: 572, top: 422 }}>Operator Signature</span>
        <span style={{ ...sig, left: 718, top: 422 }}>Driver's Signature</span>

      </div>
    </SlipScaler>
  )
}
