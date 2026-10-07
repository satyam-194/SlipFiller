import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Same palette + geometry as slips/JaySlip.jsx (1pt = 1px here).
// Any coordinate change in the PDF template must be mirrored here.
const INK = '#2b4b94'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const WMARK = '#c3cdde'
const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = '"Times New Roman", Times, serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

const FRAME = { left: 6, top: 6, width: PAGE_W - 12, height: PAGE_H - 12 }
const HEAD_RULE_Y = 112
const NOTES_RULE_Y = 356

const TONS = { left: 16, top: 14, width: 88, height: 90 }
const HRS = { left: 760, top: 12, width: 72, height: 94 }

const L = { label: 24, colon: 152, value: 184 }
const ROWS = { serial: 126, vehicle: 158, product: 190, supplier: 238, date1: 292, date2: 326 }
const TIME = { label: 404, value: 456 }
const R = {
  chargeLbl: 566, chargeVal: 648, chargeY: 200,
  wtLbl: 634, wtVal: 742, grossY: 264, tareY: 300, netY: 332,
}

const lbl = { position: 'absolute', fontSize: 16, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const netLbl = { ...lbl, fontSize: 19 }
const val = { position: 'absolute', fontSize: 15, fontFamily: DOT, color: VAL, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1.15 }
const rule = { position: 'absolute', left: FRAME.left, width: FRAME.width, height: 2, backgroundColor: INK }
const cornerSub = { fontSize: 8, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1.25, whiteSpace: 'nowrap' }
const noteRow = { position: 'absolute', display: 'flex', alignItems: 'center' }
// weight 400 to match the PDF (see slips/JaySlip.jsx — the Bold face crashes
// fontkit on the "અં" cluster, and 400 matches the press print anyway)
const guj = { fontSize: 11.5, fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap' }
const bullet = { width: 6, height: 6, backgroundColor: INK, marginRight: 7, flexShrink: 0 }

function FieldLabel({ y, text, colon = true }) {
  return (
    <>
      <span style={{ ...lbl, left: L.label, top: y }}>{text}</span>
      {colon && <span style={{ ...lbl, left: L.colon, top: y }}>:</span>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'HH:MM:00'
const fmtTime = (t) => (t && /^\d{1,2}:\d{2}$/.test(t) ? `${t.padStart(5, '0')}:00` : t)

const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
]

export default function JayPreview({ data }) {
  const centreLeft = TONS.left + TONS.width
  const centreW = HRS.left - centreLeft
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)', overflow: 'hidden' }}>

        {/* Pale "JAY" watermark under everything else */}
        <div style={{ position: 'absolute', left: 330, top: 150, fontSize: 140, fontWeight: 700, fontFamily: SERIF, color: WMARK, letterSpacing: 6, lineHeight: 1, whiteSpace: 'nowrap' }}>
          JAY
        </div>

        {/* Printed frame + section rules */}
        <div style={{ position: 'absolute', ...FRAME, boxSizing: 'border-box', border: `2.5px solid ${INK}`, borderRadius: 4 }} />
        <div style={{ ...rule, top: HEAD_RULE_Y }} />
        <div style={{ ...rule, top: NOTES_RULE_Y }} />

        {/* 50 METRIC TONS block */}
        <div style={{
          position: 'absolute', ...TONS, boxSizing: 'border-box', backgroundColor: INK, borderRadius: 3,
          paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ fontSize: 44, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1 }}>50</div>
          <div style={{ ...cornerSub, marginTop: 5 }}>METRIC TONS</div>
          <div style={cornerSub}>COMPUTERIESD</div>
        </div>

        {/* Masthead + address */}
        <div style={{ position: 'absolute', left: centreLeft, top: 12, width: centreW, textAlign: 'center', fontSize: 58, fontWeight: 700, fontFamily: SERIF, color: INK, letterSpacing: 2, whiteSpace: 'nowrap', lineHeight: 1.1 }}>
          JAY WEIGH BRIDGE
        </div>
        <div style={{ position: 'absolute', left: centreLeft, top: 84, width: centreW, textAlign: 'center', fontSize: 14.5, fontWeight: 700, fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Atika 9/4, Patel Chowk, Rajkot. Mo. : 94269 28032, 99240 06586, 98243 16116
        </div>

        {/* SERVICE 24 HOURS block */}
        <div style={{
          position: 'absolute', ...HRS, boxSizing: 'border-box', backgroundColor: INK, borderRadius: 3,
          paddingTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={cornerSub}>SERVICE</div>
          <div style={{ fontSize: 42, fontWeight: 700, fontFamily: SANS, color: '#fff', lineHeight: 1, marginTop: 2 }}>24</div>
          <div style={{ ...cornerSub, marginTop: 3 }}>HOURS</div>
        </div>

        {/* Field labels */}
        <FieldLabel y={ROWS.serial} text="Serial No." />
        <FieldLabel y={ROWS.vehicle} text="Vehicle No." />
        <FieldLabel y={ROWS.product} text="Product" />
        <FieldLabel y={ROWS.supplier} text="Supplier" />
        <FieldLabel y={ROWS.date1} text="Date" />
        <span style={{ ...lbl, left: TIME.label, top: ROWS.date1 }}>Time :</span>
        <FieldLabel y={ROWS.date2} text="Date" />
        <span style={{ ...lbl, left: TIME.label, top: ROWS.date2 }}>Time :</span>

        <span style={{ ...lbl, left: R.chargeLbl, top: R.chargeY }}>Charge</span>
        <span style={{ ...lbl, left: R.wtLbl, top: R.grossY }}>Gross Wt.</span>
        <span style={{ ...lbl, left: R.wtLbl, top: R.tareY }}>Tare Wt.</span>
        <span style={{ ...netLbl, left: R.wtLbl, top: R.netY - 2 }}>Net Wt.</span>

        {/* Values */}
        <span style={{ ...val, left: L.value, top: ROWS.serial }}>{data.serialNo}</span>
        <span style={{ ...val, left: L.value, top: ROWS.vehicle }}>{data.vehicleNo}</span>
        <span style={{ ...val, left: L.value, top: ROWS.product }}>{data.material}</span>
        <span style={{ ...val, left: L.value, top: ROWS.supplier }}>{data.party}</span>

        <span style={{ ...val, left: L.value, top: ROWS.date1 }}>{fmtDate(data.grossDate)}</span>
        <span style={{ ...val, left: TIME.value, top: ROWS.date1 }}>{fmtTime(data.grossTime)}</span>
        <span style={{ ...val, left: L.value, top: ROWS.date2 }}>{fmtDate(data.tareDate)}</span>
        <span style={{ ...val, left: TIME.value, top: ROWS.date2 }}>{fmtTime(data.tareTime)}</span>

        <span style={{ ...val, left: R.chargeVal, top: R.chargeY }}>{data.charges}</span>
        <span style={{ ...val, left: R.wtVal, top: R.grossY }}>{data.gross}</span>
        <span style={{ ...val, left: R.wtVal, top: R.tareY }}>{data.tare}</span>
        <span style={{ ...val, left: R.wtVal, top: R.netY }}>{data.net}</span>

        {/* Notes */}
        {NOTE_LINES.map((line, i) => (
          <div key={i} style={{ ...noteRow, left: 24, top: 368 + i * 17 }}>
            <span style={bullet} />
            <span style={guj}>{line}</span>
          </div>
        ))}
        <span style={{ position: 'absolute', left: 702, top: 362, fontSize: 12, fontStyle: 'italic', fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Operator's Signature
        </span>

        {/* Footer */}
        <span style={{ position: 'absolute', left: 26, top: 438, fontSize: 8, fontStyle: 'italic', fontFamily: SANS, color: INK, whiteSpace: 'nowrap' }}>
          Subject to Rajkot Jurisdiction
        </span>
        <div style={{ position: 'absolute', left: 0, top: 432, width: PAGE_W, textAlign: 'center', fontSize: 15, fontWeight: 700, fontFamily: SERIF, color: INK, whiteSpace: 'nowrap' }}>
          " AVERY " MAKE FULLY COMPUTERISED WEIGH BRIDGE
        </div>

      </div>
    </SlipScaler>
  )
}
