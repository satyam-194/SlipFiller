import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle, Ellipse, Path } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan (orange single-colour press)
const INK = '#e2641e'
const PAPER = '#ffffff'
const BOX_BG = '#ffffff'
const VAL = '#1a1a1a'

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet.
const PAGE_W = 850
const PAGE_H = 458

// Header band geometry
const HEAD = { left: 10, top: 8, right: 840, height: 112 }
const LOGO_W = 118          // globe block on the far left
const RIGHT_W = 136         // 50/5 + 24 HOURS block on the far right

// Fields box frame — positioning container for every dynamic value
const BOX = { left: 10, top: 126, width: 830, height: 218 }

const S = StyleSheet.create({
  outerBorder: {
    position: 'absolute', left: 4, top: 4, width: PAGE_W - 8, height: PAGE_H - 8,
    border: `2.5 solid ${INK}`, borderRadius: 10,
  },

  // ---- header ----
  titleBand: { backgroundColor: INK, paddingVertical: 2.5, paddingHorizontal: 10 },
  titleTxt: {
    fontSize: 33, fontFamily: 'Times-Bold', color: '#ffffff',
    textAlign: 'center', letterSpacing: 1.2,
  },
  subTitle: {
    fontSize: 17.5, fontFamily: 'Helvetica-Bold', color: INK,
    textAlign: 'center', letterSpacing: -0.2,
  },
  addr: { fontSize: 13, fontFamily: 'Helvetica', color: INK, textAlign: 'center' },

  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in the notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the single-colour press print
  // more closely than a synthetic bold. JaynathSlip uses 400 for the same text
  // and the same reason.
  gujLogo: { fontSize: 13, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK, textAlign: 'center', lineHeight: 1.1 },

  // right block
  tons: { fontSize: 37, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  tonsSub: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  hoursBand: { backgroundColor: INK, width: '100%', paddingVertical: 2 },
  hoursTxt: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },

  // ---- fields ----
  lbl: { position: 'absolute', fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
  // Typed values use the LX-310 draft face, like every other slip — these two
  // were still on Helvetica. The dot face is monospaced at 10 CPI and so runs
  // wider per character than Helvetica at the same size; 12 keeps the longest
  // values (party name, vehicle no.) inside their printed field.
  val: { position: 'absolute', fontSize: 12, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.5 },
  wLbl: { position: 'absolute', fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
  wVal: { position: 'absolute', fontSize: 12, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.5 },
  // Condensed pitch (the printer's 17 CPI mode) for the TIME column: it starts
  // at x=748 inside an 830-wide box, so an 8-char "02:35 PM" at the normal
  // size would run 17pt past the frame.
  tVal: { position: 'absolute', fontSize: 10, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.2 },
  icon: { position: 'absolute' },

  // ---- notes ----
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 12, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  guj: { fontSize: 11.5, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  lat: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: INK },
  bullet: { width: 6, height: 6, backgroundColor: INK, marginRight: 7 },
  sig: { position: 'absolute', fontSize: 13, fontFamily: 'Helvetica-Bold', color: INK },
})

// Wire-frame globe exactly as on the printed slip: an outer circle crossed by
// four meridian arcs (two narrow, two wide) and three latitude lines. The
// Gujarati house name sits in a clear band across the equator, so the two
// middle latitudes are drawn as short stubs that stop at the band edges.
const GLOBE = 104          // logo box is square
const G_CX = 52
const G_CY = 52
const G_R = 49
// Clear band for the Gujarati name. Kept narrow and inset from the rim so the
// sphere outline stays continuous on both sides — masking the full width severs
// the circle and the mark reads as two detached bowls.
const BAND_T = 36          // top of the clear text band (local coords)
const BAND_B = 68          // bottom of the clear text band
const BAND_INSET = 7       // px of circle left visible either side of the band

function GlobeLogo() {
  const mer = (rx) => (
    <Ellipse cx={G_CX} cy={G_CY} rx={rx} ry={G_R} stroke={INK} strokeWidth={1.5} fill="none" />
  )
  return (
    <Svg viewBox={`0 0 ${GLOBE} ${GLOBE}`} width={GLOBE} height={GLOBE}>
      {/* sphere outline */}
      <Circle cx={G_CX} cy={G_CY} r={G_R} stroke={INK} strokeWidth={2.2} fill="none" />
      {/* meridians */}
      {mer(16)}
      {mer(33)}
      {/* polar axis */}
      <Path d={`M${G_CX} ${G_CY - G_R} V${G_CY + G_R}`} stroke={INK} strokeWidth={1.5} />
      {/* latitudes above and below the text band */}
      <Path d={`M12 ${BAND_T - 10} H92`} stroke={INK} strokeWidth={1.5} />
      <Path d={`M12 ${BAND_B + 10} H92`} stroke={INK} strokeWidth={1.5} />
      {/* equator, clipped either side of the Gujarati band */}
      <Path d={`M3 ${G_CY} H${BAND_INSET + 4}`} stroke={INK} strokeWidth={1.5} />
      <Path d={`M${GLOBE - BAND_INSET - 4} ${G_CY} H101`} stroke={INK} strokeWidth={1.5} />
    </Svg>
  )
}

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
      <Rect x={35.6} y={10.8} width={4.2} height={4.2} fill={PAPER} />
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
      <Rect x={32.8} y={7} width={4.6} height={4.6} fill={PAPER} />
      <Circle cx={10} cy={21.5} r={3} fill={INK} />
      <Circle cx={20} cy={21.5} r={3} fill={INK} />
      <Circle cx={36.5} cy={21.5} r={3} fill={INK} />
    </Svg>
  )
}

// Solid bar (NETT) — the scan shows a filled block, not a dot grid
function NettBarIcon() {
  return (
    <Svg viewBox="0 0 34 14" width={34} height={14}>
      <Rect x={0} y={1} width={34} height={12} fill={INK} />
    </Svg>
  )
}

// Row Y centers inside the fields box (box-relative)
const ROW = { gross: 96, tare: 138, net: 180 }
// Column X positions inside the fields box
const COL = {
  icon: 12, label: 72, value: 200, kg: 404, date: 452, dateVal: 520,
  time: 688, timeVal: 748, charges: 560, chargesVal: 686,
}


// GROSS / TARE / NET print as one right-aligned column ending at 389,
// 15pt before the pre-printed "KG." at 404. Right-aligning (rather than
// leaving them left-aligned at 200) lines the figures' last digits up with each
// other and keeps a long weight from running into the label.
const WT = { left: 200, width: 189, textAlign: 'right' }

// Static half of a weigh row
function WeighRowLabels({ y, icon, label, kg, date, time }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 14 }]}>{icon}</View>
      <Text style={[S.wLbl, { left: COL.label, top: y - 7 }]}>{label}</Text>
      {kg && <Text style={[S.wLbl, { left: COL.kg, top: y - 7 }]}>KG.</Text>}
      {date && <Text style={[S.wLbl, { left: COL.date, top: y - 7 }]}>DATE :</Text>}
      {time && <Text style={[S.wLbl, { left: COL.time, top: y - 7 }]}>TIME :</Text>}
    </>
  )
}

// Dynamic half of a weigh row
function WeighRowValues({ y, value, date, dateVal, time, timeVal, color }) {
  return (
    <>
      <Text style={[S.wVal, WT, { top: y - 7, color }]}>{value || ' '}</Text>
      {date && <Text style={[S.wVal, { left: COL.dateVal, top: y - 7, color }]}>{dateVal || ' '}</Text>}
      {time && <Text style={[S.tVal, { left: COL.timeVal, top: y - 6, color }]}>{timeVal || ' '}</Text>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

// Notes: mixed Gujarati/Latin, transcribed from the scan. `lat` lines render
// in Helvetica-Bold; `guj` segments in the Gujarati face.
const NOTE_LINES = [
  { guj: 'કાંટાં ઉપરથી ચાલ્યા બાદ અમારી કોઇપણ જાતની જવાબદારી રહેતી નથી.' },
  { guj: 'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.' },
  { guj: 'ચોવીસ કલાક પહેલા તોલ થયેલી ટ્રક / લારીનો વજન બાદ કરી આપવામાં આવશે નહીં.' },
  { lat: 'MANUAL TARE WEIGH ', guj: 'માટે વે-બ્રીજ જવાબદાર નથી.' },
  { lat: 'SUBJECT TO RAJKOT JURISDICTION.' },
]

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
export default function DhartiSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  const headInner = HEAD.right - HEAD.left
  const centreW = headInner - LOGO_W - RIGHT_W

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

        {showStatic && (
          <>
            {/* Outer rounded printed border */}
            <View style={S.outerBorder} />

            {/* ---- Header ---- */}
            {/* Globe logo; the Gujarati house name sits in a clear band across
                the equator, painted over the wireframe like the original */}
            <View style={{ position: 'absolute', left: HEAD.left + 6, top: HEAD.top + 4 }}>
              <GlobeLogo />
              <View style={{
                position: 'absolute', left: BAND_INSET, top: BAND_T,
                width: GLOBE - 2 * BAND_INSET, height: BAND_B - BAND_T,
                backgroundColor: PAPER, justifyContent: 'center',
              }}>
                <Text style={S.gujLogo}>ધરતી</Text>
                <Text style={[S.gujLogo, { marginTop: 0.5 }]}>વે-બ્રીજ</Text>
              </View>
            </View>

            {/* Centre column: reversed title band + subtitle + address */}
            <View style={{ position: 'absolute', left: HEAD.left + LOGO_W, top: HEAD.top + 2, width: centreW }}>
              <View style={S.titleBand}>
                <Text style={S.titleTxt}>DHARTI WEIGH BRIDGE</Text>
              </View>
              <Text style={[S.subTitle, { marginTop: 4 }]}>FULLY ELECTRONIC COMPUTERISED WEIGH-BRIDGE</Text>
              <Text style={[S.addr, { marginTop: 5 }]}>80, Feet Naheru nagar Main Road, (ATIKA)</Text>
              <Text style={[S.addr, { marginTop: 3 }]}>Dhebar Road, South, RAJKOT - 360 002. Mo. : 98250 26841</Text>
            </View>

            {/* Right block: bordered box holding 50/5 + METRIC TONS, with the
                reversed 24 HOURS SERVICE strip inset at the bottom */}
            <View style={{
              position: 'absolute', left: HEAD.right - RIGHT_W, top: HEAD.top,
              width: RIGHT_W, height: HEAD.height,
              border: `2.2 solid ${INK}`, borderRadius: 4,
              paddingTop: 3, paddingHorizontal: 4, paddingBottom: 4,
              alignItems: 'center', justifyContent: 'flex-start',
            }}>
              <Text style={S.tons}>50/5</Text>
              <Text style={S.tonsSub}>METRIC TONS</Text>
              <Text style={S.tonsSub}>COMPUTERISED</Text>
              <View style={[S.hoursBand, { marginTop: 4 }]}>
                <Text style={S.hoursTxt}>24 HOURS</Text>
                <Text style={S.hoursTxt}>SERVICE</Text>
              </View>
            </View>
          </>
        )}

        {/* Fields box — frame belongs to the stationery, the View is the
            positioning container for all values in every mode */}
        <View style={[
          { position: 'absolute', ...BOX },
          showStatic ? { border: `2.5 solid ${INK}`, borderRadius: 6, backgroundColor: BOX_BG } : null,
        ]}>
          {showStatic && (
            <>
              <Text style={[S.lbl, { left: 14, top: 14 }]}>RST No.</Text>
              <Text style={[S.lbl, { left: 14, top: 38 }]}>MATERIAL</Text>
              <Text style={[S.lbl, { left: 540, top: 14 }]}>VEHICLE No. :</Text>
              <Text style={[S.lbl, { left: 540, top: 38 }]}>RECEIVER :</Text>

              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" kg date time />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" kg date time />
              <WeighRowLabels y={ROW.net} icon={<NettBarIcon />} label="NETT :" kg />
              <Text style={[S.wLbl, { left: COL.charges, top: ROW.net - 7 }]}>Charges(Rs) :</Text>
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: 152, top: 14, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: 152, top: 38, color: vColor }]}>{data.material || ' '}</Text>
              <Text style={[S.val, { left: 662, top: 14, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: 662, top: 38, color: vColor }]}>{data.party || ' '}</Text>
              <WeighRowValues y={ROW.gross} value={data.gross} date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} color={vColor} />
              <WeighRowValues y={ROW.tare} value={data.tare} date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} color={vColor} />
              <WeighRowValues y={ROW.net} value={data.net} color={vColor} />
              <Text style={[S.wVal, { left: COL.chargesVal, top: ROW.net - 7, color: vColor }]}>{data.charges || ' '}</Text>
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* Notes block */}
            <View style={[S.noteRow, { left: 14, top: 350 }]}>
              <Text style={S.gujLead}>{'સુચના : '}</Text>
              <View style={S.bullet} />
              <Text style={S.guj}>વજન કરતી વખતે બન્ને પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            </View>
            {NOTE_LINES.map((line, i) => (
              <View key={i} style={[S.noteRow, { left: 86, top: 368 + i * 16 }]}>
                <View style={S.bullet} />
                {line.lat && <Text style={S.lat}>{line.lat}</Text>}
                {line.guj && <Text style={S.guj}>{line.guj}</Text>}
              </View>
            ))}

            <Text style={[S.sig, { left: 672, top: 433 }]}>Operator Signature</Text>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
