import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan (navy single-colour press)
const INK = '#1f3864'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet. All coordinates below are measured
// off the scan of the printed slip.
const PAGE_W = 850
const PAGE_H = 458

// Thin printed border around the entire slip
const FRAME = { left: 14, top: 10, width: 822, height: 438 }

// Header: two bordered capacity stacks flanking the masthead column.
// The left stack reads 100 / METRIC TONS / COMPUTERISED / PLATFORM SIZE / 50 X 10,
// the right 10 / METRIC TONS / COMPUTERISED / PLATFORM SIZE / 14 X 7.
const HEAD_TOP = 16
const CAP_W = 120
const CAP_H = 122
const CAP_L = FRAME.left + 5
const CAP_R = FRAME.left + FRAME.width - CAP_W - 5

// Rows inside each capacity stack
const CAP_NUM_H = 42        // big numeral
const CAP_SUB_H = 16        // METRIC TONS
const CAP_SUB2_H = 16       // COMPUTERISED
const CAP_PLAT_H = 15       // PLATFORM SIZE (reversed strip)

// Centre column between the stacks
const MID = { left: CAP_L + CAP_W, width: CAP_R - (CAP_L + CAP_W) }
const TITLE_TOP = HEAD_TOP + 2
const SUB = { top: HEAD_TOP + 48, height: 24 }   // reversed subtitle band
const ADDR_TOP = HEAD_TOP + 77
const GOVT_TOP = HEAD_TOP + 95

// Fields area — a bordered box below the header, holding every dynamic value
const BOX = { left: FRAME.left + 5, top: 144, width: FRAME.width - 10, height: 168 }

// Left label column inside the box
const L = { label: 26, colon: 124, value: 166 }
const ROWS = { serial: 10, party: 32 }
// Right column (VEHICLE No. / MATERIAL)
const R = { label: 490, colon: 588, value: 610, vehicle: 24, material: 48 }

// Weigh rows (box-relative Y centres)
const ROW = { gross: 84, tare: 116, net: 148 }
const COL = {
  icon: 12, label: 66, value: 186, kg: 286, date: 326, dateVal: 414,
  time: 572, timeVal: 656,
}
// Charges prints below the NETT row, right of centre
// label is 13 condensed chars (~140pt) from 548, so the amount starts at 700
const CHARGES = { label: 548, value: 700, top: 142 }

// 24 HOURS SERVICE block sits at bottom-left, inside the notes band
const HRS = { left: FRAME.left + 5, top: 320, width: 112, height: 80 }

// Notes column starts to the right of that block
const NOTES_LEFT = HRS.left + HRS.width + 10
const NOTES_TOP = 322
const NOTES_STEP = 15

const S = StyleSheet.create({
  frame: { position: 'absolute', ...FRAME, border: `2 solid ${INK}` },

  // ---- header ----
  capBox: { position: 'absolute', border: `2 solid ${INK}` },
  capNum: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  capSub: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  // PLATFORM SIZE prints reversed (white on navy)
  capPlatBand: { backgroundColor: INK, justifyContent: 'center' },
  capPlatTxt: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  capSize: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },

  title: {
    position: 'absolute', left: MID.left, width: MID.width, top: TITLE_TOP,
    // 28pt keeps the masthead on ONE line in react-pdf, whose Times-Bold runs
    // wider than the browser's — at 33 it wrapped and shoved the layout down.
    fontSize: 28, fontFamily: 'Times-Bold', color: INK, textAlign: 'center',
  },
  // reversed subtitle band
  subBand: { position: 'absolute', backgroundColor: INK, justifyContent: 'center' },
  subBandTxt: { fontSize: 14.5, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  addr: {
    position: 'absolute', left: MID.left, width: MID.width,
    fontSize: 11, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center',
  },
  govt: {
    position: 'absolute', left: MID.left, width: MID.width,
    fontSize: 15, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center',
  },

  // ---- fields ----
  box: { position: 'absolute', ...BOX },
  lbl: { position: 'absolute', fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontSize: 15, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },
  // Condensed pitch (the printer's 17 CPI mode) for runs that will not fit
  // their field at 10 CPI: the 13-char registration, the DATE runs (which
  // would reach the pre-printed TIME label) and the Charges caption.
  valNarrow: { position: 'absolute', fontSize: 11, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.4 },
  // the weighing software prints the weight figures enlarged
  wVal: { position: 'absolute', fontSize: 19, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1.5 },
  icon: { position: 'absolute' },

  // ---- 24 HOURS SERVICE block ----
  hrsBox: { position: 'absolute', ...HRS, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  hrsNum: { fontSize: 38, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  hrsTxt: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },

  // ---- notes ----
  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in these notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the single-colour press print
  // more closely than a synthetic bold. The other slips use 400 likewise.
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 12, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  guj: { fontSize: 11, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  bullet: { width: 5.5, height: 5.5, backgroundColor: INK, marginRight: 6 },
  jurisdiction: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },
  sig: { position: 'absolute', fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
})

// Side-view truck outline (GROSS) — cab + box body on two wheels
function TruckLoadedIcon() {
  return (
    <Svg viewBox="0 0 46 26" width={46} height={26}>
      <Rect x={1} y={3} width={28} height={14} stroke={INK} strokeWidth={1.6} fill="none" />
      <Rect x={29} y={8} width={12} height={9} stroke={INK} strokeWidth={1.6} fill="none" />
      <Circle cx={9} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
      <Circle cx={34} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
    </Svg>
  )
}

// Empty flatbed truck (TARE) — low deck, cab at the rear
function TruckEmptyIcon() {
  return (
    <Svg viewBox="0 0 46 26" width={46} height={26}>
      <Rect x={1} y={11} width={28} height={6} stroke={INK} strokeWidth={1.6} fill="none" />
      <Rect x={29} y={6} width={12} height={11} stroke={INK} strokeWidth={1.6} fill="none" />
      <Circle cx={9} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
      <Circle cx={34} cy={21} r={3.4} stroke={INK} strokeWidth={1.6} fill="none" />
    </Svg>
  )
}

// NETT icon — a hatched bar, as printed
function NettBarIcon() {
  const bars = []
  for (let i = 0; i < 9; i++)
    bars.push(<Rect key={`b${i}`} x={2.5 + i * 4} y={3} width={1.8} height={8} fill={INK} />)
  return (
    <Svg viewBox="0 0 40 14" width={40} height={14}>
      <Rect x={0.8} y={0.8} width={38.4} height={12.4} stroke={INK} strokeWidth={1.4} fill="none" />
      {bars}
    </Svg>
  )
}

// Capacity stack — ONE continuous outlined rectangle; the PLATFORM SIZE strip
// is reversed and spans the full inner width, so the outline never breaks.
function CapacityBlock({ left, num, size }) {
  return (
    <View style={[S.capBox, { left, top: HEAD_TOP, width: CAP_W, height: CAP_H }]}>
      <View style={{ height: CAP_NUM_H, justifyContent: 'center' }}>
        <Text style={S.capNum}>{num}</Text>
      </View>
      <View style={{ height: CAP_SUB_H, justifyContent: 'center' }}>
        <Text style={S.capSub}>METRIC TONS</Text>
      </View>
      <View style={{ height: CAP_SUB2_H, justifyContent: 'center' }}>
        <Text style={S.capSub}>COMPUTERISED</Text>
      </View>
      <View style={[S.capPlatBand, { height: CAP_PLAT_H }]}>
        <Text style={S.capPlatTxt}>PLATFORM SIZE</Text>
      </View>
      <View style={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={S.capSize}>{size}</Text>
      </View>
    </View>
  )
}


// GROSS / TARE / NET print as one right-aligned column ending at 271,
// 15pt before the pre-printed "Kg." unit. The column starts at 128 — just
// clear of the "GROSS :" label at 66 — so it is 143pt wide, enough for a
// 6-digit weight at this slip's enlarged weight type. Right-aligning keeps the
// figures' last digits in line whatever the digit count.
const WT = { left: 128, width: 143, textAlign: 'right' }

// Static half of a weigh row
function WeighRowLabels({ y, icon, label, date, time }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 13 }]}>{icon}</View>
      <Text style={[S.lbl, { left: COL.label, top: y - 7 }]}>{label}</Text>
      <Text style={[S.lbl, { left: COL.kg, top: y - 7 }]}>KG.</Text>
      {date && <Text style={[S.lbl, { left: COL.date, top: y - 7 }]}>DATE :</Text>}
      {time && <Text style={[S.lbl, { left: COL.time, top: y - 7 }]}>TIME :</Text>}
    </>
  )
}

// Dynamic half of a weigh row; the weight figure prints enlarged
function WeighRowValues({ y, value, date, dateVal, time, timeVal, color }) {
  return (
    <>
      <Text style={[S.wVal, WT, { top: y - 10, color }]}>{value || ' '}</Text>
      {date && <Text style={[S.valNarrow, { left: COL.dateVal, top: y - 6, color }]}>{dateVal || ' '}</Text>}
      {time && <Text style={[S.valNarrow, { left: COL.timeVal, top: y - 6, color }]}>{timeVal || ' '}</Text>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// This slip prints plain 24h 'HH:MM' — the form value passes through as-is
const fmtTime = (t) => t

// Notes transcribed from the scan (Gujarati, square bullets, સુચના : lead)
const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
]

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
export default function HarikrushnaSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

        {showStatic && (
          <>
            {/* Thin printed border around the whole slip */}
            <View style={S.frame} />

            {/* ---- Header ---- */}
            <CapacityBlock left={CAP_L} num="100" size="50 X 10" />
            <CapacityBlock left={CAP_R} num="10" size="14 X 7" />

            <Text style={S.title}>HARIKRUSHNA WEIGH BRIDGE</Text>

            {/* Reversed subtitle band spanning the centre column */}
            <View style={[S.subBand, { left: MID.left, top: SUB.top, width: MID.width, height: SUB.height }]}>
              <Text style={S.subBandTxt}>FULLY DIGITAL COMPUTERISED WEIGH BRIDGE</Text>
            </View>

            <Text style={[S.addr, { top: ADDR_TOP }]}>
              Near Sanjivani Casting. SIDC Road, Veraval (Shapar), Dist. RAJKOT - 360 024. Mo. 81285 18567.
            </Text>
            <Text style={[S.govt, { top: GOVT_TOP }]}>A GOVERNMENT APPROVED</Text>
          </>
        )}

        {/* Fields box — frame belongs to the stationery, the View is the
            positioning container for all values in every mode */}
        <View style={[S.box, showStatic ? { border: `2 solid ${INK}` } : null]}>
          {showStatic && (
            <>
              <Text style={[S.lbl, { left: L.label, top: ROWS.serial }]}>SERIAL No. :</Text>
              <Text style={[S.lbl, { left: L.label, top: ROWS.party }]}>PARTY</Text>
              <Text style={[S.lbl, { left: L.colon, top: ROWS.party }]}>:</Text>

              <Text style={[S.lbl, { left: R.label, top: R.vehicle }]}>VEHICLE No. :</Text>
              <Text style={[S.lbl, { left: R.label, top: R.material }]}>MATERIAL :</Text>

              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" date time />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" date time />
              <WeighRowLabels y={ROW.net} icon={<NettBarIcon />} label="NETT :" />
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: L.value, top: ROWS.serial - 1, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: L.value, top: ROWS.party - 1, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.valNarrow, { left: R.value, top: R.vehicle + 1, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: R.value, top: R.material - 1, color: vColor }]}>{data.material || ' '}</Text>

              <WeighRowValues y={ROW.gross} value={data.gross} date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} color={vColor} />
              <WeighRowValues y={ROW.tare} value={data.tare} date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} color={vColor} />
              <WeighRowValues y={ROW.net} value={data.net} color={vColor} />

              {/* The weighing software prints the Charges label with the amount
                  — it is not part of the pre-printed stationery */}
              {data.charges ? (
                <>
                  <Text style={[S.valNarrow, { left: CHARGES.label, top: CHARGES.top + 2, color: vColor }]}>Charges(Rs) :</Text>
                  <Text style={[S.valNarrow, { left: CHARGES.value, top: CHARGES.top + 2, color: vColor }]}>{data.charges}</Text>
                </>
              ) : null}
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* 24 HOURS SERVICE block, bottom-left */}
            <View style={S.hrsBox}>
              <Text style={S.hrsNum}>24</Text>
              <Text style={S.hrsTxt}>HOURS</Text>
              <Text style={S.hrsTxt}>SERVICE</Text>
            </View>

            {/* Notes */}
            <View style={[S.noteRow, { left: NOTES_LEFT, top: NOTES_TOP }]}>
              <Text style={S.gujLead}>{'સુચના : '}</Text>
              <View style={S.bullet} />
              <Text style={S.guj}>{NOTE_LINES[0]}</Text>
            </View>
            {NOTE_LINES.slice(1).map((line, i) => (
              <View key={i} style={[S.noteRow, { left: NOTES_LEFT + 18, top: NOTES_TOP + (i + 1) * NOTES_STEP }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line}</Text>
              </View>
            ))}
            <View style={[S.noteRow, { left: NOTES_LEFT + 18, top: NOTES_TOP + 4 * NOTES_STEP }]}>
              <View style={S.bullet} />
              <Text style={S.jurisdiction}>Subject to Rajkot Jurisdiction</Text>
            </View>

            <Text style={[S.sig, { left: 560, top: 424 }]}>Operator's Signature</Text>
            <Text style={[S.sig, { left: 706, top: 424 }]}>Driver's Signature</Text>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
