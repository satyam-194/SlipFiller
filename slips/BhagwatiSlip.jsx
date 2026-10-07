import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan. This slip is printed in
// red on a pale pink sheet, with a second black plate used for the masthead
// roundel, the ISO rules and the capacity block.
const INK = '#d42027'          // red press plate
const BLACK = '#1a1a1a'        // black press plate
const PAPER = '#fdeaea'        // pale pink stock
const INNER = '#ffffff'        // white panel the fields sit on
const VAL = '#1a1a1a'

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet.
const PAGE_W = 850
const PAGE_H = 458

// Double printed border: outer red rule plus an inner rounded rule
const FRAME = { left: 10, top: 8, width: 830, height: 442 }
const FRAME2 = { left: 20, top: 17, width: 810, height: 424 }

// ---- header ----
const HEAD_TOP = 26
// "BHAGWATI": printed as BHAG + a black roundel holding a reversed W + ATI.
// Each piece is placed explicitly so the roundel lands between the letters.
const BHAG_X = 40
const MARK = { left: 152, top: HEAD_TOP - 2, size: 44 }   // roundel over the W
const ATI_X = MARK.left + MARK.size - 2
const WEIGH_X = 286           // "Weigh Bridge" sits right of the wordmark
const MATRIX_TOP = HEAD_TOP + 50
const PLOT_TOP = HEAD_TOP + 66
const GOVT_TOP = HEAD_TOP + 88

// ISO 9001 CERTIFIED block, clear of the address lines to its left
const ISO = { left: 626, top: HEAD_TOP + 18, width: 104, height: 56 }
// Solid capacity block in the top-right corner
const CAP = { left: 740, top: HEAD_TOP - 14, width: 94, height: 100 }
const CAP_NUM_H = 34
const CAP_SUB_H = 13
const CAP_HRS_H = 32          // reversed 24 HOURS SERVICE strip

// ---- fields ----
// White rounded panel holding every label and value
const BOX = { left: 30, top: 140, width: 790, height: 182 }

const L = { label: 14, labelW: 150, value: 180 }
const ROWS = { serial: 10, party: 32 }
const R = { label: 470, labelW: 180, value: 666, vehicle: 32, material: 56 }

// Weigh rows (box-relative Y centres)
const ROW = { gross: 90, tare: 126, net: 158 }
const COL = {
  icon: 12, label: 76, value: 182, kg: 300, date: 356, dateVal: 430,
  time: 578, timeVal: 650, charge: 356,
}
// CHARGE label is pre-printed on the NETT row; the amount comes from the
// weighing software, which prints its own "Charges(Rs):" caption too.
const CHARGES = { label: 440, value: 592 }

// ---- notes ----
const NOTES_LEFT = 34
const NOTES_TOP = 330
const NOTES_STEP = 16

const S = StyleSheet.create({
  frame: { position: 'absolute', ...FRAME, border: `3 solid ${INK}`, borderRadius: 6 },
  frame2: { position: 'absolute', ...FRAME2, border: `1.5 solid ${INK}`, borderRadius: 10 },

  // ---- header ----
  titleTxt: {
    position: 'absolute', top: HEAD_TOP - 4,
    fontSize: 42, fontFamily: 'Times-Bold', color: INK, letterSpacing: 1,
  },
  weighTxt: {
    position: 'absolute', left: WEIGH_X, top: HEAD_TOP + 2,
    fontSize: 34, fontFamily: 'Times-Bold', color: INK,
  },
  matrix: {
    position: 'absolute', left: WEIGH_X, top: MATRIX_TOP,
    fontSize: 11, fontFamily: 'Helvetica-Bold', color: INK,
  },
  // 10.5pt keeps the longer address line clear of the ISO block: react-pdf's
  // Helvetica-Bold runs wider than the browser's, and at 11 it reached ~613 of
  // the 626 available — too tight to survive the difference.
  plot: {
    position: 'absolute', left: WEIGH_X, top: PLOT_TOP,
    fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: INK,
  },
  govt: {
    position: 'absolute', left: 0, width: PAGE_W, top: GOVT_TOP,
    fontSize: 17, fontFamily: 'Helvetica-Bold', color: BLACK, textAlign: 'center',
  },

  // ISO block: black rules above and below the two lines
  isoRule: { position: 'absolute', backgroundColor: BLACK, height: 5 },
  isoTxt: { position: 'absolute', fontSize: 15, fontFamily: 'Helvetica-Bold', color: BLACK, textAlign: 'center' },

  // capacity block, solid black with reversed sub-rows
  capBox: { position: 'absolute', ...CAP, backgroundColor: BLACK },
  capNum: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  capSub: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  capHrs: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },

  // ---- fields ----
  box: { position: 'absolute', ...BOX },
  lblR: { position: 'absolute', fontSize: 14.5, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'right' },
  lbl: { position: 'absolute', fontSize: 14.5, fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontSize: 15, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },
  // the weighing software prints the weight figures enlarged
  wVal: { position: 'absolute', fontSize: 20, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1.5 },
  icon: { position: 'absolute' },

  // ---- notes ----
  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in these notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the press print more closely
  // than a synthetic bold. The other slips use 400 likewise.
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 12.5, fontFamily: 'NotoGujarati', fontWeight: 400, color: BLACK },
  guj: { fontSize: 11.5, fontFamily: 'NotoGujarati', fontWeight: 400, color: BLACK },
  bullet: { width: 6, height: 6, backgroundColor: BLACK, marginRight: 7 },
  jurisdiction: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: BLACK },
  sig: { position: 'absolute', fontSize: 13, fontFamily: 'Helvetica-Bold', color: INK },
})

// "BHAGWATI" wordmark — the W is reversed out of a solid black roundel that
// overlaps the red lettering, exactly as printed.
function WordMark() {
  return (
    <View style={{ position: 'absolute', left: MARK.left, top: MARK.top }}>
      <Svg viewBox={`0 0 ${MARK.size} ${MARK.size}`} width={MARK.size} height={MARK.size}>
        <Circle cx={MARK.size / 2} cy={MARK.size / 2} r={MARK.size / 2} fill={BLACK} />
      </Svg>
      <Text style={{
        position: 'absolute', left: 0, top: 6, width: MARK.size,
        fontSize: 30, fontFamily: 'Times-Bold', color: PAPER, textAlign: 'center',
      }}>W</Text>
    </View>
  )
}

// Dot-matrix loaded truck (GROSS)
function TruckLoadedIcon() {
  const dots = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 5; c++)
      dots.push(<Rect key={`d${r}-${c}`} x={2 + c * 4.6} y={3 + r * 4.2} width={3.4} height={3.2} fill={BLACK} />)
  return (
    <Svg viewBox="0 0 44 26" width={44} height={26}>
      {dots}
      <Rect x={1} y={15.5} width={25} height={3.5} fill={BLACK} />
      <Rect x={26} y={8} width={9} height={11} fill={BLACK} />
      <Circle cx={7} cy={22} r={2.8} fill={BLACK} />
      <Circle cx={16} cy={22} r={2.8} fill={BLACK} />
      <Circle cx={30} cy={22} r={2.8} fill={BLACK} />
    </Svg>
  )
}

// Empty truck (TARE) — flat deck, no load
function TruckEmptyIcon() {
  return (
    <Svg viewBox="0 0 44 26" width={44} height={26}>
      <Rect x={1} y={13} width={25} height={5} fill={BLACK} />
      <Rect x={26} y={6} width={10} height={12} fill={BLACK} />
      <Circle cx={7} cy={21.5} r={2.8} fill={BLACK} />
      <Circle cx={16} cy={21.5} r={2.8} fill={BLACK} />
      <Circle cx={31} cy={21.5} r={2.8} fill={BLACK} />
    </Svg>
  )
}

// NETT icon — three small outlined squares
function NettSquaresIcon() {
  return (
    <Svg viewBox="0 0 44 16" width={44} height={16}>
      <Rect x={1} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
      <Rect x={15} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
      <Rect x={29} y={2} width={12} height={12} stroke={BLACK} strokeWidth={2.2} fill="none" />
    </Svg>
  )
}

// Static half of a weigh row
function WeighRowLabels({ y, icon, label, kg, date, time, charge }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 13 }]}>{icon}</View>
      <Text style={[S.lbl, { left: COL.label, top: y - 8 }]}>{label}</Text>
      {kg && <Text style={[S.lbl, { left: COL.kg, top: y - 8 }]}>Kg.</Text>}
      {date && <Text style={[S.lbl, { left: COL.date, top: y - 8 }]}>DATE :</Text>}
      {time && <Text style={[S.lbl, { left: COL.time, top: y - 8 }]}>TIME :</Text>}
      {charge && <Text style={[S.lbl, { left: COL.charge, top: y - 8 }]}>CHARGE :</Text>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'hh:MM AM/PM' — this slip prints 12-hour time
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

// Notes transcribed from the scan. The 4th line carries the jurisdiction note
// inline after the Gujarati; the last two concern manual tare weight.
const NOTE_LINES = [
  { guj: 'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું' },
  { guj: 'વજન થઇ ગયા પછી અમારી કોઇપણ જાતની જવાબદારી રહેતી નથી.' },
  { guj: 'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.' },
  { guj: 'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.', lat: 'Subject to Rajkot Jurisdiction.' },
  { guj: '“✻” નીશાન મેન્યુઅલ ટેર વેઇટ દશાવિ છે.' },
  { guj: 'મેન્યુઅલ ટેર વેઇટ માટે અમારી કોઇપણ જવાબદારી રહેતી નથી.' },
]

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
export default function BhagwatiSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

        {showStatic && (
          <>
            {/* Double printed border */}
            <View style={S.frame} />
            <View style={S.frame2} />

            {/* ---- Masthead ---- */}
            {/* "BHAG" + roundel W + "ATI", then "Weigh Bridge" */}
            <Text style={[S.titleTxt, { left: BHAG_X }]}>BHAG</Text>
            <WordMark />
            <Text style={[S.titleTxt, { left: ATI_X }]}>ATI</Text>
            <Text style={S.weighTxt}>Weigh Bridge</Text>

            <Text style={S.matrix}>"MATRIX" MAKE FULLY COMPUTERISED WEIGH BRIDGE</Text>
            <Text style={S.plot}>PLOT NO. 188, KUVADVA G.I.D.C., KUVADAVA. M. 92276 62564</Text>
            <Text style={S.govt}>A GOVERNMENT APPROVED</Text>

            {/* ISO 9001 CERTIFIED, ruled above and below */}
            <View style={[S.isoRule, { left: ISO.left, top: ISO.top, width: ISO.width }]} />
            <Text style={[S.isoTxt, { left: ISO.left, top: ISO.top + 9, width: ISO.width }]}>ISO : 9001</Text>
            <Text style={[S.isoTxt, { left: ISO.left, top: ISO.top + 27, width: ISO.width }]}>CERTIFIED</Text>
            <View style={[S.isoRule, { left: ISO.left, top: ISO.top + ISO.height - 5, width: ISO.width }]} />

            {/* Solid capacity block, top-right */}
            <View style={S.capBox}>
              <View style={{ height: CAP_NUM_H, justifyContent: 'center' }}>
                <Text style={S.capNum}>100</Text>
              </View>
              <View style={{ height: CAP_SUB_H, justifyContent: 'center' }}>
                <Text style={S.capSub}>METRIC TONS</Text>
              </View>
              <View style={{ height: CAP_SUB_H, justifyContent: 'center' }}>
                <Text style={S.capSub}>COMPUTERISED</Text>
              </View>
              <View style={{ height: CAP_HRS_H, justifyContent: 'center' }}>
                <Text style={S.capHrs}>24 HOURS</Text>
                <Text style={S.capHrs}>SERVICE</Text>
              </View>
            </View>
          </>
        )}

        {/* Fields panel — white rounded box on the pink stock. The View is the
            positioning container for all values in every mode. */}
        <View style={[S.box, showStatic ? { backgroundColor: INNER, border: `1.5 solid ${INK}`, borderRadius: 10 } : null]}>
          {showStatic && (
            <>
              <Text style={[S.lblR, { left: L.label, width: L.labelW, top: ROWS.serial }]}>SERIAL NO. :</Text>
              <Text style={[S.lblR, { left: L.label, width: L.labelW, top: ROWS.party }]}>PARTY :</Text>

              <Text style={[S.lblR, { left: R.label, width: R.labelW, top: R.vehicle }]}>VEHICLE NO. :</Text>
              <Text style={[S.lblR, { left: R.label, width: R.labelW, top: R.material }]}>MATERIAL :</Text>

              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kg date time />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kg date time />
              <WeighRowLabels y={ROW.net} icon={<NettSquaresIcon />} label="NETT :" kg charge />
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: L.value, top: ROWS.serial - 1, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: L.value, top: ROWS.party - 1, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.val, { left: R.value, top: R.vehicle - 1, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: R.value, top: R.material - 1, color: vColor }]}>{data.material || ' '}</Text>

              <Text style={[S.wVal, { left: COL.value, top: ROW.gross - 11, color: vColor }]}>{data.gross || ' '}</Text>
              <Text style={[S.val, { left: COL.dateVal, top: ROW.gross - 8, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Text>
              <Text style={[S.val, { left: COL.timeVal, top: ROW.gross - 8, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>

              <Text style={[S.wVal, { left: COL.value, top: ROW.tare - 11, color: vColor }]}>{data.tare || ' '}</Text>
              <Text style={[S.val, { left: COL.dateVal, top: ROW.tare - 8, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Text>
              <Text style={[S.val, { left: COL.timeVal, top: ROW.tare - 8, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>

              <Text style={[S.wVal, { left: COL.value, top: ROW.net - 11, color: vColor }]}>{data.net || ' '}</Text>

              {/* The weighing software prints its own "Charges(Rs):" caption
                  next to the pre-printed CHARGE label */}
              {data.charges ? (
                <>
                  <Text style={[S.val, { left: CHARGES.label, top: ROW.net - 8, color: vColor }]}>Charges(Rs):</Text>
                  <Text style={[S.val, { left: CHARGES.value, top: ROW.net - 8, color: vColor }]}>{data.charges}</Text>
                </>
              ) : null}
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* Notes */}
            <View style={[S.noteRow, { left: NOTES_LEFT, top: NOTES_TOP }]}>
              <Text style={S.gujLead}>{'સૂચનાः '}</Text>
              <View style={S.bullet} />
              <Text style={S.guj}>{NOTE_LINES[0].guj}</Text>
            </View>
            {NOTE_LINES.slice(1).map((line, i) => (
              <View key={i} style={[S.noteRow, { left: NOTES_LEFT + 68, top: NOTES_TOP + (i + 1) * NOTES_STEP }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line.guj}</Text>
                {line.lat && (
                  <>
                    <View style={[S.bullet, { marginLeft: 10 }]} />
                    <Text style={S.jurisdiction}>{line.lat}</Text>
                  </>
                )}
              </View>
            ))}

            <Text style={[S.sig, { left: 570, top: 398 }]}>Operator's Signature</Text>
            <Text style={[S.sig, { left: 718, top: 398 }]}>Driver's Signature</Text>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
