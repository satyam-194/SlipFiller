import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan
const INK = '#e13464'
const PAPER = '#fce3f2'
const BOX_BG = '#fdf0f9'

// Typed-value ink. The weighbridge's dot-matrix ribbon is worn, so values come
// out a light neutral grey, not black. Measured off a close-up of a real slip,
// normalised against the paper in the same shot (that photo is underexposed —
// its "white" reads 196, not 255 — so raw pixel values would mislead): the
// strokes read about 63% of paper reflectance, i.e. ~#a9a9a9.
//
// Laser printers also render a light grey darker than its nominal value, since
// halftoning a pale tone tends to over-ink. #a0a0a0 is therefore set at the
// light end of the measured range rather than the middle. If prints still come
// out too dark, raise this number (#b0b0b0, #bcbcbc); lower it to darken.
const VAL = '#a0a0a0'

// Design canvas: scan is 1054x568 px -> 850x458 pt (scale 0.8065).
// All absolute coordinates below are in this canvas space.
const PAGE_W = 850
const PAGE_H = 458

// Fields box frame — positioning container for every dynamic value
const BOX = { left: 14, top: 125, width: PAGE_W - 40, height: 220 }

const S = StyleSheet.create({
  outerBorder: {
    position: 'absolute', left: 4, top: 4, width: PAGE_W - 22, height: PAGE_H - 8,
    border: `2.5 solid ${INK}`,
  },

  // ---- header side boxes ----
  sideBox: {
    position: 'absolute', top: 11, width: 90, height: 103,
    border: `2.8 solid ${INK}`, backgroundColor: PAPER,
    flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
  },
  sideNumWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sideNum: { fontSize: 52, fontFamily: 'Helvetica-Bold', color: INK },
  sideBadge: { backgroundColor: INK, width: '100%', paddingVertical: 3.5, paddingHorizontal: 1 },
  sideTxt: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },
  sideTxtSm: { fontSize: 8.6, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },

  // ---- header center ----
  center: { position: 'absolute', left: 106, top: 8, width: 624, alignItems: 'center' },
  companyName: { fontSize: 30, fontFamily: 'Times-Bold', color: INK, textAlign: 'center' },
  banner: { backgroundColor: INK, paddingHorizontal: 28, paddingVertical: 3.5, marginTop: 2 },
  bannerTxt: { color: '#ffffff', fontSize: 15.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', letterSpacing: 0.8 },
  address: { fontSize: 13.5, color: INK, textAlign: 'center', marginTop: 4 },
  approved: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center', marginTop: 1 },

  // ---- fields box ----
  lbl: { position: 'absolute', fontSize: 13, fontFamily: 'Helvetica-Bold', color: INK },
  // Typed values use the LX-310 draft face. Size and letter spacing are set so
  // the character pitch matches the weighbridge computer's print head as
  // measured on a photographed real slip: 13.2pt per character cell in canvas
  // units (fontSize 13 em-advance + 0.25 spacing). Every value carries an
  // explicit width so react-pdf lays it out on one line — without one, a value
  // near the right edge wraps or is clipped mid-character.
  val: { position: 'absolute', fontSize: 13, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.25, width: 220 },
  wLbl: { position: 'absolute', fontSize: 13.5, fontFamily: 'Helvetica-Bold', color: INK },
  wVal: { position: 'absolute', fontSize: 13, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.25, width: 220 },
  icon: { position: 'absolute' },

  // ---- notes ----
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 11.5, fontFamily: 'NotoGujarati', fontWeight: 700, color: INK },
  guj: { fontSize: 10.8, fontFamily: 'NotoGujarati', fontWeight: 700, color: INK },
  lat: { fontSize: 12, fontFamily: 'Helvetica', color: INK },
  bullet: { width: 6.5, height: 6.5, backgroundColor: INK, marginRight: 7 },
  sig: { position: 'absolute', fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: INK },

  credit: { fontSize: 8, color: INK, fontFamily: 'Helvetica', textAlign: 'left', letterSpacing: 0.3 },
})

// Dot-matrix loaded truck (GROSS)
function TruckLoadedIcon() {
  const dots = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 7; c++)
      dots.push(<Rect key={`d${r}-${c}`} x={1 + c * 4.2} y={1 + r * 4.2} width={3.1} height={3.1} fill={INK} />)
  return (
    <Svg viewBox="0 0 46 30" width={46} height={30}>
      {dots}
      <Rect x={0.5} y={17.5} width={33.5} height={4} fill={INK} />
      <Rect x={34} y={9} width={9.5} height={12.5} fill={INK} />
      <Rect x={35.6} y={10.8} width={4.2} height={4.2} fill={BOX_BG} />
      <Circle cx={7} cy={25.5} r={3} fill={INK} />
      <Circle cx={17} cy={25.5} r={3} fill={INK} />
      <Circle cx={37.5} cy={25.5} r={3} fill={INK} />
    </Svg>
  )
}

// Dot-matrix empty truck (TARE)
function TruckEmptyIcon() {
  return (
    <Svg viewBox="0 0 46 30" width={46} height={30}>
      <Rect x={0} y={14.5} width={5} height={2} fill={INK} />
      <Rect x={5} y={12.5} width={26} height={4.5} fill={INK} />
      <Rect x={31} y={5} width={11} height={12} fill={INK} />
      <Rect x={32.8} y={7} width={4.6} height={4.6} fill={BOX_BG} />
      <Circle cx={10} cy={21.5} r={3} fill={INK} />
      <Circle cx={20} cy={21.5} r={3} fill={INK} />
      <Circle cx={36.5} cy={21.5} r={3} fill={INK} />
    </Svg>
  )
}

// Dot grid (NET)
function NetGridIcon() {
  const dots = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 8; c++)
      dots.push(<Rect key={`n${r}-${c}`} x={c * 4.2} y={r * 4.2} width={3.1} height={3.1} fill={INK} />)
  return (
    <Svg viewBox="0 0 34 17" width={34} height={17}>
      {dots}
    </Svg>
  )
}

// Row Y centers inside the fields box (box-relative)
const ROW = { gross: 112, tare: 155, net: 196 }
// Column X positions inside the fields box
const COL = { icon: 10, label: 62, value: 122, kg: 299, date: 341, dateVal: 392, time: 588, timeVal: 638, charges: 500, chargesVal: 610 }

// Where the weighbridge computer actually drops its dot-matrix output,
// measured off a photo of a real printed slip (homography to canvas space,
// each value anchored to its nearest pre-printed label to cancel the photo's
// perspective). Box-relative coordinates. The machine's text lines do NOT sit
// on the pre-printed label rows: every line prints high — the serial/vehicle
// line lands right across the fields-box top border, party/material land on
// the SERIAL/VEHICLE row, the weights float ~17pt above their own labels —
// and the photo is the authority on all of it.
const V = {
  line1: -2.2,  // serial + vehicle no (straddles the box top border, like the photo)
  line2: 25.5,  // party + material (on the pre-printed SERIAL/VEHICLE row)
  // Weigh rows. The pitch between them is the pre-printed form's own row
  // pitch, measured off a test print: 43.4pt from gross to tare and 40.6pt
  // from tare to net. Earlier these were 48.7 and 28.3, which is why the tare
  // line drifted well below its label while net crowded up against it.
  gross: 95,
  tare: 138.4,
  net: 179,
  // Column positions, all in one coordinate system. These are deliberately
  // NOT adjusted to stop values overlapping labels in the 'full' preview —
  // only the printed 'values' overlay matters, and there the labels come from
  // the pre-printed paper, not from us. Compensating a column to keep the
  // preview tidy cancels out part of FIT_X and breaks the real registration,
  // so every column here moves together with FIT_X and nothing else.
  serialX: 139,
  // Party is the longest left-hand value, so after FIT_X it is the one that
  // reaches the paper edge first: at 113.2 it started 3pt from x=0, close
  // enough that a slightly left-fed sheet would clip the first letter. Held
  // back far enough to keep a usable margin.
  partyX: 135,
  dateX: 457.2,
  timeX: 712.9,
  chargesX: 697,
  // Right-hand column (vehicle no / material / charges), centred rather than
  // left-anchored: the real machine runs a long vehicle number off the edge of
  // the form, which a PDF cannot do — the page ends and the text is clipped
  // mid-character. Centring lets a 13-character number fit while a short one
  // ("COAL") still lands where the machine puts it.
  rightMid: 739,
  rightWidth: 220,
}

// Registration of the whole values layer against the pre-printed paper,
// calibrated from test prints laid on the real stationery.
//
// These two numbers are the ONLY place registration is corrected. The column
// constants in V above stay at their measured positions: nudging an individual
// column to stop it overlapping a label in the on-screen 'full' preview would
// silently cancel part of this shift, and the preview's labels are not what
// the values land on — the paper's are. A collision in the preview is
// expected and harmless; only the 'values' overlay is printed.
//
// Derived from the weight column, which is the one column never adjusted
// per-field and so reads honestly. On the latest test print the gross and net
// figures each overlapped the pre-printed "KG." by about 40pt, and every value
// sat ~21pt above its label — hence a further 52pt left (40 of overlap plus
// ~12 of clearance before KG.) and 11pt down on top of the previous -72 / 9.
const FIT_X = -124
const FIT_Y = 20

// Right column values: centred on V.rightMid so long entries grow both ways
// and stay on the form instead of running past the page edge.
const RIGHT = { left: V.rightMid - V.rightWidth / 2, width: V.rightWidth, textAlign: 'center' }

// GROSS / TARE / NET print as one right-aligned column; on the real slip the
// 4-digit gross ends 38pt right of the "KG." label's left edge (the weight
// floats a line above the label, so overlapping its x-range is correct).
// Right-aligning lines the figures' last digits up with each other.
const WT = { left: 179.6, width: 162, textAlign: 'right' }

// Static half of a weigh row: icon + GROSS/TARE/NET, KG., DATE :, TIME : labels
function WeighRowLabels({ y, icon, label, kg, date, time }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 14 }]}>{icon}</View>
      <Text style={[S.wLbl, { left: COL.label, top: y - 6 }]}>{label}</Text>
      {kg && <Text style={[S.wLbl, { left: COL.kg, top: y - 6 }]}>KG.</Text>}
      {date && <Text style={[S.wLbl, { left: COL.date, top: y - 6 }]}>DATE :</Text>}
      {time && <Text style={[S.wLbl, { left: COL.time, top: y - 6 }]}>TIME :</Text>}
    </>
  )
}

// Dynamic half of a weigh row: weight, date and time values. y is the
// machine print line (V.gross / V.tare / V.net), not the label row.
function WeighRowValues({ y, value, date, dateVal, time, timeVal, color }) {
  return (
    <>
      <Text style={[S.wVal, WT, { top: y, color }]}>{value || ' '}</Text>
      {date && <Text style={[S.wVal, { left: V.dateX, top: y, color }]}>{dateVal || ' '}</Text>}
      {time && <Text style={[S.wVal, { left: V.timeX, top: y, color }]}>{timeVal || ' '}</Text>}
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

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
// offsetX/offsetY (pt): nudge applied to the values layer only, to compensate
//       for how the pre-printed continuous paper is loaded in the tractor feed
export default function AmbikaSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false, pageMode = 'landscape' }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  // Same faded-ribbon grey in every mode. The overlay used to force pure black
  // here, which is the one mode that actually goes on the pre-printed paper —
  // so the printed values came out far darker than the real machine's.
  const vColor = VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug} pageMode={pageMode}>

        {showStatic && (
          <>
            {/* Outer printed border */}
            <View style={S.outerBorder} />

            {/* 24 HOURS SERVICE box */}
            <View style={[S.sideBox, { left: 16 }]}>
              <View style={S.sideNumWrap}>
                <Text style={S.sideNum}>24</Text>
              </View>
              <View style={S.sideBadge}>
                <Text style={S.sideTxt}>HOURS</Text>
                <Text style={S.sideTxt}>SERVICE</Text>
              </View>
            </View>

            {/* 50 METRIC TONS box */}
            <View style={[S.sideBox, { left: 730 }]}>
              <View style={S.sideNumWrap}>
                <Text style={S.sideNum}>50</Text>
              </View>
              <View style={S.sideBadge}>
                <Text style={S.sideTxtSm}>METRIC TONS</Text>
                <Text style={S.sideTxtSm}>COMPUTERISED</Text>
              </View>
            </View>

            {/* Header center */}
            <View style={S.center}>
              <Text style={S.companyName}>SHREE JAY AMBIKA WEIGH BRIDGE</Text>
              <View style={S.banner}>
                <Text style={S.bannerTxt}>FULLY  COMPUTERISED WEIGH-BRIDGE</Text>
              </View>
              <Text style={S.address}>6 - MAVDI PLOT CORNER, MAVDI ROAD, RAJKOT. Mo. : 63547 98792</Text>
              <Text style={S.approved}>(A GOVERNMENT APPROVED)</Text>
            </View>
          </>
        )}

        {/* Fields box — frame/fill belong to the stationery, the View itself is
            the positioning container for all values in every mode */}
        <View style={[
          { position: 'absolute', ...BOX },
          showStatic ? { border: `2.5 solid ${INK}`, backgroundColor: BOX_BG } : null,
        ]}>
          {showStatic && (
            <>
              <Text style={[S.lbl, { left: 14, top: 20 }]}>SERIAL No.:</Text>
              <Text style={[S.lbl, { left: 526, top: 20 }]}>VEHICLE No. :</Text>
              <Text style={[S.lbl, { left: 14, top: 44 }]}>PARTY :</Text>
              <Text style={[S.lbl, { left: 554, top: 44 }]}>MATERIAL :</Text>
              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kg date time />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kg date time />
              <WeighRowLabels y={ROW.net} icon={<NetGridIcon />} label="NET :" kg />
              <Text style={[S.wLbl, { left: COL.charges, top: ROW.net - 6 }]}>Charges(Rs) :</Text>
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: FIT_X + offsetX, top: FIT_Y + offsetY, width: PAGE_W, height: BOX.height }}>
              <Text style={[S.val, { left: V.serialX, top: V.line1, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, RIGHT, { top: V.line1, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: V.partyX, top: V.line2, width: 500, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.val, RIGHT, { top: V.line2, color: vColor }]}>{data.material || ' '}</Text>
              <WeighRowValues y={V.gross} value={data.gross} date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} color={vColor} />
              <WeighRowValues y={V.tare} value={data.tare} date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} color={vColor} />
              <WeighRowValues y={V.net} value={data.net} color={vColor} />
              <Text style={[S.wVal, RIGHT, { top: V.net, color: vColor }]}>{data.charges || ' '}</Text>
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* Notes */}
            <View style={[S.noteRow, { left: 8, top: 352 }]}>
              <Text style={S.gujLead}>{'સુચના : '}</Text>
              <View style={S.bullet} />
              <Text style={S.guj}>વજન કરતી વખતે બન્ને પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            </View>
            {NOTE_LINES.map((line, i) => (
              <View key={i} style={[S.noteRow, { left: 68, top: 374 + i * 20 }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line}</Text>
              </View>
            ))}
            <View style={[S.noteRow, { left: 68, top: 434 }]}>
              <View style={S.bullet} />
              <Text style={S.lat}>Subject to Rajkot Jurisdiction.</Text>
            </View>
            <Text style={[S.sig, { left: 500, top: 433 }]}>Operator Signature</Text>
            <Text style={[S.sig, { left: 695, top: 433 }]}>Driver's Signature</Text>

            {/* Printer credit outside the border on the right margin (reads bottom-to-top) */}
            <View style={{ position: 'absolute', left: 760, top: 361, width: 160, height: 10, transform: 'rotate(-90deg)' }}>
              <Text style={S.credit}>BALAJI MULTI FORMS - (0281) 2360163</Text>
            </View>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
