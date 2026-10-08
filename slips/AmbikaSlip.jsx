import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan
const INK = '#e13464'
const PAPER = '#fce3f2'
const BOX_BG = '#fdf0f9'
const VAL = '#1a1a1a'

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
  // Typed values use the LX-310 draft face, like every other slip — these two
  // were still on Helvetica. The dot face is monospaced at 10 CPI and so runs
  // wider per character than Helvetica at the same size; 11.5/12 keeps the
  // longest values inside their printed field.
  val: { position: 'absolute', fontSize: 11.5, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.5 },
  wLbl: { position: 'absolute', fontSize: 13.5, fontFamily: 'Helvetica-Bold', color: INK },
  wVal: { position: 'absolute', fontSize: 12, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.5 },
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

// Dynamic half of a weigh row: weight, date and time values
function WeighRowValues({ y, value, date, dateVal, time, timeVal, color }) {
  return (
    <>
      <Text style={[S.wVal, { left: COL.value, top: y - 6, color }]}>{value || ' '}</Text>
      {date && <Text style={[S.wVal, { left: COL.dateVal, top: y - 6, color }]}>{dateVal || ' '}</Text>}
      {time && <Text style={[S.wVal, { left: COL.timeVal, top: y - 6, color }]}>{timeVal || ' '}</Text>}
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
export default function AmbikaSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

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
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: 98, top: 20, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: 622, top: 20, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: 74, top: 44, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.val, { left: 634, top: 44, color: vColor }]}>{data.material || ' '}</Text>
              <WeighRowValues y={ROW.gross} value={data.gross} date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} color={vColor} />
              <WeighRowValues y={ROW.tare} value={data.tare} date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} color={vColor} />
              <WeighRowValues y={ROW.net} value={data.net} color={vColor} />
              <Text style={[S.wVal, { left: COL.chargesVal, top: ROW.net - 6, color: vColor }]}>{data.charges || ' '}</Text>
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
