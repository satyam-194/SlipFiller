import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan (crimson single-colour press)
const INK = '#b5245c'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet. All coordinates below are measured
// off the scan of the printed slip.
const PAGE_W = 850
const PAGE_H = 458

// Outer printed border — rounded, as on this slip
const FRAME = { left: 12, top: 10, width: 826, height: 440 }

// Header: two bordered capacity stacks flanking the masthead column.
// Left reads 5 / MATRIC TONS / COMPUTERISED + reversed 24 HOURS SERVICE;
// right reads 100 with the same sub-rows. ("MATRIC" is the press's spelling.)
const HEAD_TOP = 22
const CAP_L_W = 98
const CAP_R_W = 118
const CAP_H = 104
const CAP_L = FRAME.left + 14
const CAP_R = FRAME.left + FRAME.width - CAP_R_W - 14

// Rows inside each capacity stack
const CAP_NUM_H = 34       // big numeral
const CAP_SUB_H = 14       // MATRIC TONS
const CAP_SUB2_H = 14      // COMPUTERISED
// the remainder is the reversed 24 HOURS / SERVICE block

// Centre column between the stacks
const MID = { left: CAP_L + CAP_L_W, width: CAP_R - (CAP_L + CAP_L_W) }
const TITLE_TOP = HEAD_TOP - 4
// reversed subtitle pill, narrower than the column and centred
const SUB = { width: 420, top: HEAD_TOP + 48, height: 25 }
const ADDR_TOP = HEAD_TOP + 76

// Fields area — rounded box below the header holding every dynamic value
const BOX = { left: FRAME.left + 14, top: 118, width: FRAME.width - 28, height: 196 }

// Left label column inside the box (labels are right-aligned to their colons)
const L = { label: 20, labelW: 150, value: 190 }
const ROWS = { serial: 8, party: 32 }
// Right column (VEHICLE NO. / MATERIAL)
const R = { label: 470, labelW: 170, value: 650, vehicle: 32, material: 56 }

// Weigh rows (box-relative Y centres). Each row's DATE/TIME labels sit ~14
// below its centre, so the last row must leave that much clear of the border.
const ROW = { gross: 88, tare: 128, net: 166 }
const COL = {
  icon: 14, label: 78, value: 190, kg: 300, date: 340, dateVal: 430,
  time: 590, timeVal: 672,
}
// CHARGES (Rs.) prints from the weighing software. It sits on the NET line,
// right of the "Kg. :" label and clear of the DATE/TIME runs above it.
// The label is 15 condensed chars ~= 171pt wide, so the amount has to start
// clear of 430+171; 610 leaves a single space between them.
const CHARGES = { label: 430, value: 610, top: 158 }

// Notes band below the fields box
const NOTES_LEFT = FRAME.left + 16
const NOTES_TOP = 324
const NOTES_STEP = 14.5

// Reversed "A Government Approved" pill, centred in the notes band
const GOVT = { left: 360, top: 320, width: 200, height: 20 }

const S = StyleSheet.create({
  frame: { position: 'absolute', ...FRAME, border: `2 solid ${INK}`, borderRadius: 10 },

  // ---- header ----
  capBox: { position: 'absolute', border: `1.8 solid ${INK}` },
  capNum: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  capSub: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  // the 24 HOURS / SERVICE block prints reversed (white on crimson)
  capHrsBand: { backgroundColor: INK, flexGrow: 1, justifyContent: 'center' },
  capHrsTxt: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },

  title: {
    position: 'absolute', left: MID.left, width: MID.width, top: TITLE_TOP,
    fontSize: 40, fontFamily: 'Times-Bold', color: INK, textAlign: 'center',
  },
  // reversed subtitle pill
  subBand: { position: 'absolute', backgroundColor: INK, borderRadius: 4, justifyContent: 'center' },
  subBandTxt: { fontSize: 15.5, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  addr: {
    position: 'absolute', left: MID.left, width: MID.width,
    fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center',
  },

  // ---- fields ----
  box: { position: 'absolute', ...BOX },
  // labels right-align so every colon lines up, as printed
  lblR: { position: 'absolute', fontSize: 15, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'right' },
  lbl: { position: 'absolute', fontSize: 15, fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontSize: 15, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },
  // the weighing software prints the weight figures enlarged
  wVal: { position: 'absolute', fontSize: 20, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1.5 },
  // Condensed pitch. The LX-310 switches to 17 CPI (ESC SI) for a run that
  // would otherwise overflow its field, rather than printing past the edge —
  // a full 13-char registration at 10 CPI is 207pt wide but the VEHICLE NO.
  // field only has 148pt before the frame, and "CHARGES (Rs.) :" at 10 CPI
  // would run under its own amount. Same face, narrower cell.
  valNarrow: { position: 'absolute', fontSize: 11, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.4 },
  icon: { position: 'absolute' },

  // ---- notes ----
  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in these notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the single-colour press print
  // more closely than a synthetic bold. The other slips use 400 likewise.
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 11, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  guj: { fontSize: 10, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  bullet: { width: 5, height: 5, backgroundColor: INK, marginRight: 5 },
  jurisdiction: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },

  govtPill: { position: 'absolute', ...GOVT, backgroundColor: INK, borderRadius: 4, justifyContent: 'center' },
  govtTxt: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },

  thanks: {
    position: 'absolute', left: 0, width: PAGE_W, top: 404,
    fontSize: 18, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center',
  },
  sig: { position: 'absolute', fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: INK },
})

// Boxed delivery truck with hatched body (GROSS)
function TruckLoadedIcon() {
  const lines = []
  for (let i = 0; i < 4; i++)
    lines.push(<Rect key={`l${i}`} x={4} y={5 + i * 3.2} width={18} height={1.6} fill={INK} />)
  return (
    <Svg viewBox="0 0 48 30" width={48} height={30}>
      <Rect x={2} y={2.5} width={22} height={17} stroke={INK} strokeWidth={1.8} fill="none" />
      {lines}
      <Rect x={24} y={8} width={14} height={11.5} stroke={INK} strokeWidth={1.8} fill="none" />
      <Circle cx={10} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
      <Circle cx={31} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
    </Svg>
  )
}

// Empty van outline (TARE) — plain body, no hatching
function TruckEmptyIcon() {
  return (
    <Svg viewBox="0 0 48 30" width={48} height={30}>
      <Rect x={2} y={2.5} width={22} height={17} stroke={INK} strokeWidth={1.8} fill="none" />
      <Rect x={24} y={8} width={14} height={11.5} stroke={INK} strokeWidth={1.8} fill="none" />
      <Circle cx={10} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
      <Circle cx={31} cy={24} r={3.6} stroke={INK} strokeWidth={1.8} fill="none" />
    </Svg>
  )
}

// NET icon — three solid bars
function NetBarsIcon() {
  return (
    <Svg viewBox="0 0 44 12" width={44} height={12}>
      <Rect x={0} y={2} width={12} height={7} fill={INK} />
      <Rect x={15} y={2} width={12} height={7} fill={INK} />
      <Rect x={30} y={2} width={12} height={7} fill={INK} />
    </Svg>
  )
}

// Capacity stack — ONE continuous outlined rectangle; the reversed
// 24 HOURS / SERVICE block fills its full inner width at the bottom, so the
// outline never breaks.
function CapacityBlock({ left, width, num }) {
  return (
    <View style={[S.capBox, { left, top: HEAD_TOP, width, height: CAP_H }]}>
      <View style={{ height: CAP_NUM_H, justifyContent: 'center' }}>
        <Text style={S.capNum}>{num}</Text>
      </View>
      <View style={{ height: CAP_SUB_H, justifyContent: 'center' }}>
        <Text style={S.capSub}>MATRIC TONS</Text>
      </View>
      <View style={{ height: CAP_SUB2_H, justifyContent: 'center' }}>
        <Text style={S.capSub}>COMPUTERISED</Text>
      </View>
      <View style={S.capHrsBand}>
        <Text style={S.capHrsTxt}>24 HOURS</Text>
        <Text style={S.capHrsTxt}>SERVICE</Text>
      </View>
    </View>
  )
}

// Static half of a weigh row. On GROSS/TARE the "Kg. DATE :" run sits a line
// BELOW the row label (dy=14); on NET the "Kg. :" is on the same line (dy=0).
function WeighRowLabels({ y, icon, label, kgLabel, kgDy = 14 }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 15 }]}>{icon}</View>
      <Text style={[S.lbl, { left: COL.label, top: y - 8 }]}>{label}</Text>
      <Text style={[S.lbl, { left: COL.kg, top: y - 8 + kgDy }]}>{kgLabel}</Text>
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// This slip prints plain 24h 'HH:MM' — the form value passes through as-is
const fmtTime = (t) => t

// Notes transcribed from the scan (Gujarati, star bullets, સુચના : lead)
const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
]

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
export default function ViratSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

        {showStatic && (
          <>
            {/* Rounded printed border around the whole slip */}
            <View style={S.frame} />

            {/* ---- Header ---- */}
            <CapacityBlock left={CAP_L} width={CAP_L_W} num="5" />
            <CapacityBlock left={CAP_R} width={CAP_R_W} num="100" />

            <Text style={S.title}>VIRAT WEIGH-BRIDGE</Text>

            {/* Reversed subtitle pill, centred in the column */}
            <View style={[S.subBand, {
              left: MID.left + (MID.width - SUB.width) / 2,
              top: SUB.top, width: SUB.width, height: SUB.height,
            }]}>
              <Text style={S.subBandTxt}>FULLY COMPUTERISED WEIGH BRIDGE</Text>
            </View>

            <Text style={[S.addr, { top: ADDR_TOP }]}>
              NR. JITHRIYA HANUMAN TEMPLES, MAVDI MAIN ROAD, RAJKOT-4.
            </Text>
          </>
        )}

        {/* Fields box — frame belongs to the stationery, the View is the
            positioning container for all values in every mode */}
        <View style={[S.box, showStatic ? { border: `2 solid ${INK}`, borderRadius: 10 } : null]}>
          {showStatic && (
            <>
              <Text style={[S.lblR, { left: L.label, width: L.labelW, top: ROWS.serial }]}>SERIAL NO.:</Text>
              <Text style={[S.lblR, { left: L.label, width: L.labelW, top: ROWS.party }]}>PARTY :</Text>

              <Text style={[S.lblR, { left: R.label, width: R.labelW, top: R.vehicle }]}>VEHICLE NO. :</Text>
              <Text style={[S.lblR, { left: R.label, width: R.labelW, top: R.material }]}>MATERIAL :</Text>

              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kgLabel="Kg. DATE :" />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kgLabel="Kg. DATE :" />
              <WeighRowLabels y={ROW.net} icon={<NetBarsIcon />} label="NET :" kgLabel="Kg. :" kgDy={0} />

              {/* TIME labels sit a line below their DATE, as printed */}
              <Text style={[S.lbl, { left: COL.time, top: ROW.gross + 6 }]}>TIME :</Text>
              <Text style={[S.lbl, { left: COL.time, top: ROW.tare + 6 }]}>TIME :</Text>
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: L.value, top: ROWS.serial - 1, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: L.value, top: ROWS.party - 1, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.valNarrow, { left: R.value, top: R.vehicle + 1, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: R.value, top: R.material - 1, color: vColor }]}>{data.material || ' '}</Text>

              {/* Weight figures print above their row's label line */}
              <Text style={[S.wVal, { left: COL.value, top: ROW.gross - 30, color: vColor }]}>{data.gross || ' '}</Text>
              <Text style={[S.val, { left: COL.dateVal, top: ROW.gross - 14, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Text>
              <Text style={[S.val, { left: COL.timeVal, top: ROW.gross + 2, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>

              <Text style={[S.wVal, { left: COL.value, top: ROW.tare - 12, color: vColor }]}>{data.tare || ' '}</Text>
              <Text style={[S.val, { left: COL.dateVal, top: ROW.tare + 6, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Text>
              <Text style={[S.val, { left: COL.timeVal, top: ROW.tare + 6, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>

              <Text style={[S.wVal, { left: COL.value, top: ROW.net - 11, color: vColor }]}>{data.net || ' '}</Text>

              {/* The weighing software prints the CHARGES label with the
                  amount — it is not part of the pre-printed stationery */}
              {data.charges ? (
                <>
                  <Text style={[S.valNarrow, { left: CHARGES.label, top: CHARGES.top + 2, color: vColor }]}>CHARGES (Rs.) :</Text>
                  <Text style={[S.valNarrow, { left: CHARGES.value, top: CHARGES.top + 2, color: vColor }]}>{data.charges}/-</Text>
                </>
              ) : null}
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* Notes */}
            <View style={[S.noteRow, { left: NOTES_LEFT, top: NOTES_TOP }]}>
              <Text style={S.gujLead}>{'સુચના : '}</Text>
              <Text style={S.guj}>{'✻ ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.'}</Text>
            </View>
            {NOTE_LINES.map((line, i) => (
              <View key={i} style={[S.noteRow, { left: NOTES_LEFT, top: NOTES_TOP + (i + 1) * NOTES_STEP }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line}</Text>
              </View>
            ))}
            <View style={[S.noteRow, { left: NOTES_LEFT, top: NOTES_TOP + 4 * NOTES_STEP }]}>
              <View style={S.bullet} />
              <Text style={S.jurisdiction}>Subject to Rajkot Jurisdiction.</Text>
            </View>

            {/* Reversed "A Government Approved" pill */}
            <View style={S.govtPill}>
              <Text style={S.govtTxt}>A Government Approved</Text>
            </View>

            <Text style={S.thanks}>THANKS FOR VISIT</Text>
            <Text style={[S.sig, { left: 572, top: 422 }]}>Operator Signature</Text>
            <Text style={[S.sig, { left: 718, top: 422 }]}>Driver's Signature</Text>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
