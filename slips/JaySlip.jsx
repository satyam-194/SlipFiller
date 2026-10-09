import React from 'react'
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan (navy single-colour press)
const INK = '#2b4b94'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'
const WMARK = '#c3cdde'   // pale "JAY" watermark behind the fields

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet.
const PAGE_W = 850
const PAGE_H = 458

// Printed frame + full-width section rules
const FRAME = { left: 6, top: 6, width: PAGE_W - 12, height: PAGE_H - 12 }
const HEAD_RULE_Y = 112   // header / fields divider
const NOTES_RULE_Y = 356  // fields / notes divider

// Header corner blocks (solid navy, white text)
const TONS = { left: 16, top: 14, width: 88, height: 90 }   // 50 METRIC TONS
const HRS = { left: 760, top: 12, width: 72, height: 94 }   // SERVICE 24 HOURS

// Left label column: label | colon | value
const L = { label: 24, colon: 152, value: 184 }
const ROWS = { serial: 126, vehicle: 158, product: 190, supplier: 238, date1: 292, date2: 326 }
const TIME = { label: 404, value: 456 }

// Right column: Charge + weight stack
const R = {
  chargeLbl: 566, chargeVal: 648, chargeY: 200,
  wtLbl: 634, wtVal: 742, grossY: 264, tareY: 300, netY: 332,
}

const S = StyleSheet.create({
  frame: {
    position: 'absolute', ...FRAME,
    border: `2.5 solid ${INK}`, borderRadius: 4,
  },
  rule: { position: 'absolute', left: FRAME.left, width: FRAME.width, height: 2, backgroundColor: INK },

  // ---- header ----
  title: {
    position: 'absolute', fontSize: 58, fontFamily: 'Times-Bold', color: INK,
    textAlign: 'center', letterSpacing: 2,
  },
  addr: {
    position: 'absolute', fontSize: 14.5, fontFamily: 'Helvetica-Bold', color: INK,
    textAlign: 'center',
  },
  cornerBox: { position: 'absolute', backgroundColor: INK, alignItems: 'center', borderRadius: 3 },
  tonsNum: { fontSize: 44, fontFamily: 'Helvetica-Bold', color: '#ffffff', lineHeight: 1 },
  cornerSub: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },
  hrsNum: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: '#ffffff', lineHeight: 1 },

  // ---- fields ----
  lbl: { position: 'absolute', fontSize: 16, fontFamily: 'Times-Bold', color: INK },
  netLbl: { position: 'absolute', fontSize: 19, fontFamily: 'Times-Bold', color: INK },
  // Same size and letter spacing as JaynathSlip's typed values.
  val: { position: 'absolute', fontSize: 13.5, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },

  // pale press-printed "JAY" behind the fields
  watermark: {
    position: 'absolute', left: 330, top: 150, fontSize: 140,
    fontFamily: 'Times-Bold', color: WMARK, letterSpacing: 6,
  },

  // ---- notes ----
  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in these notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the single-colour press print
  // more closely than a synthetic bold. DhartiSlip uses 400 for the same text
  // and the same reason.
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  guj: { fontSize: 11.5, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  bullet: { width: 6, height: 6, backgroundColor: INK, marginRight: 7 },
  sig: { position: 'absolute', fontSize: 12, fontFamily: 'Helvetica-Oblique', color: INK },

  // ---- footer ----
  avery: {
    position: 'absolute', fontSize: 15, fontFamily: 'Times-Bold', color: INK,
    textAlign: 'center', left: 0, width: PAGE_W,
  },
  jurisdiction: { position: 'absolute', fontSize: 8, fontFamily: 'Helvetica-Oblique', color: INK },
})

// Label + aligned colon, the way the press prints the left column
function FieldLabel({ y, text, colon = true }) {
  return (
    <>
      <Text style={[S.lbl, { left: L.label, top: y }]}>{text}</Text>
      {colon && <Text style={[S.lbl, { left: L.colon, top: y }]}>:</Text>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'HH:MM:00' — the slip prints 24h time with seconds
const fmtTime = (t) => (t && /^\d{1,2}:\d{2}$/.test(t) ? `${t.padStart(5, '0')}:00` : t)

// Notes transcribed from the scan (Gujarati, square bullets)
const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
]

// Fake bold, as in JaynathSlip. react-pdf has no text-shadow, so the extra
// strikes are real <Text> layers drawn at the same position plus a sub-point
// offset. The dot-matrix glyphs are built from isolated dots; the extra passes
// keep the strokes from breaking up when printed.
const BOLD_OFFSETS = [[0.35, 0], [0, 0.35]]

function Val({ style, children }) {
  const flat = Object.assign({}, ...[].concat(style).filter(Boolean))
  return (
    <>
      <Text style={flat}>{children}</Text>
      {BOLD_OFFSETS.map(([dx, dy], i) => (
        <Text
          key={i}
          style={{ ...flat, left: (flat.left || 0) + dx, top: (flat.top || 0) + dy }}
        >
          {children}
        </Text>
      ))}
    </>
  )
}

// Registration correction for the 'values' overlay ONLY — the mode that prints
// onto the pre-printed paper. Measured from a printed sample: the typed values
// landed right of their pre-printed colons, so the whole layer shifts left.
// The 'full'/'blank' previews keep the unshifted coordinates.
const VALUES_DX = -40

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only)
export default function JaySlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false, pageMode = 'landscape' }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  // Mid grey, matching JaynathSlip: lighter than the pre-printed labels, but
  // dark enough that the dot-matrix glyphs hold together. Pure black (used
  // here before) printed far heavier than the real machine's ribbon.
  const vColor = isValues ? '#6e6e6e' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug} pageMode={pageMode}>

        {showStatic && (
          <>
            {/* Pale "JAY" watermark sits under everything else */}
            <Text style={S.watermark}>JAY</Text>

            {/* Printed frame + section rules */}
            <View style={S.frame} />
            <View style={[S.rule, { top: HEAD_RULE_Y }]} />
            <View style={[S.rule, { top: NOTES_RULE_Y }]} />

            {/* ---- Header ---- */}
            {/* 50 METRIC TONS block, top-left corner */}
            <View style={[S.cornerBox, { ...TONS, paddingTop: 4 }]}>
              <Text style={S.tonsNum}>50</Text>
              <Text style={[S.cornerSub, { marginTop: 5 }]}>METRIC TONS</Text>
              <Text style={S.cornerSub}>COMPUTERIESD</Text>
            </View>

            {/* Masthead + address between the corner blocks */}
            <Text style={[S.title, { left: TONS.left + TONS.width, top: 12, width: HRS.left - TONS.left - TONS.width }]}>
              JAY WEIGH BRIDGE
            </Text>
            <Text style={[S.addr, { left: TONS.left + TONS.width, top: 84, width: HRS.left - TONS.left - TONS.width }]}>
              Atika 9/4, Patel Chowk, Rajkot. Mo. : 94269 28032, 99240 06586, 98243 16116
            </Text>

            {/* SERVICE 24 HOURS block, top-right corner */}
            <View style={[S.cornerBox, { ...HRS, paddingTop: 5 }]}>
              <Text style={S.cornerSub}>SERVICE</Text>
              <Text style={[S.hrsNum, { marginTop: 2 }]}>24</Text>
              <Text style={[S.cornerSub, { marginTop: 3 }]}>HOURS</Text>
            </View>

            {/* ---- Field labels ---- */}
            <FieldLabel y={ROWS.serial} text="Serial No." />
            <FieldLabel y={ROWS.vehicle} text="Vehicle No." />
            <FieldLabel y={ROWS.product} text="Product" />
            <FieldLabel y={ROWS.supplier} text="Supplier" />
            <FieldLabel y={ROWS.date1} text="Date" />
            <Text style={[S.lbl, { left: TIME.label, top: ROWS.date1 }]}>Time :</Text>
            <FieldLabel y={ROWS.date2} text="Date" />
            <Text style={[S.lbl, { left: TIME.label, top: ROWS.date2 }]}>Time :</Text>

            <Text style={[S.lbl, { left: R.chargeLbl, top: R.chargeY }]}>Charge</Text>
            <Text style={[S.lbl, { left: R.wtLbl, top: R.grossY }]}>Gross Wt.</Text>
            <Text style={[S.lbl, { left: R.wtLbl, top: R.tareY }]}>Tare Wt.</Text>
            <Text style={[S.netLbl, { left: R.wtLbl, top: R.netY - 2 }]}>Net Wt.</Text>

            {/* ---- Notes ---- */}
            {NOTE_LINES.map((line, i) => (
              <View key={i} style={[S.noteRow, { left: 24, top: 368 + i * 17 }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line}</Text>
              </View>
            ))}
            <Text style={[S.sig, { left: 702, top: 362 }]}>Operator's Signature</Text>

            {/* ---- Footer ---- */}
            <Text style={[S.jurisdiction, { left: 26, top: 438 }]}>Subject to Rajkot Jurisdiction</Text>
            <Text style={[S.avery, { top: 432 }]}>" AVERY " MAKE FULLY COMPUTERISED WEIGH BRIDGE</Text>
          </>
        )}

        {/* ---- Values (dot-matrix layer) ---- */}
        {showValues && (
          <View style={{ position: 'absolute', left: offsetX + (isValues ? VALUES_DX : 0), top: offsetY, width: PAGE_W, height: PAGE_H }}>
            <Val style={[S.val, { left: L.value, top: ROWS.serial, color: vColor }]}>{data.serialNo || ' '}</Val>
            <Val style={[S.val, { left: L.value, top: ROWS.vehicle, color: vColor }]}>{data.vehicleNo || ' '}</Val>
            <Val style={[S.val, { left: L.value, top: ROWS.product, color: vColor }]}>{data.material || ' '}</Val>
            <Val style={[S.val, { left: L.value, top: ROWS.supplier, color: vColor }]}>{data.party || ' '}</Val>

            <Val style={[S.val, { left: L.value, top: ROWS.date1, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Val>
            <Val style={[S.val, { left: TIME.value, top: ROWS.date1, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Val>
            <Val style={[S.val, { left: L.value, top: ROWS.date2, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Val>
            <Val style={[S.val, { left: TIME.value, top: ROWS.date2, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Val>

            <Val style={[S.val, { left: R.chargeVal, top: R.chargeY, color: vColor }]}>{data.charges || ' '}</Val>
            <Val style={[S.val, { left: R.wtVal, top: R.grossY, color: vColor }]}>{data.gross || ' '}</Val>
            <Val style={[S.val, { left: R.wtVal, top: R.tareY, color: vColor }]}>{data.tare || ' '}</Val>
            <Val style={[S.val, { left: R.wtVal, top: R.netY, color: vColor }]}>{data.net || ' '}</Val>
          </View>
        )}

      </PrintPage>
    </Document>
  )
}
