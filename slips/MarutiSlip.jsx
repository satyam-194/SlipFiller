import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original printed slip scan (green single-colour press)
const INK = '#2f9e4f'
const PAPER = '#ffffff'
const VAL = '#1a1a1a'

// Design canvas, same 850-wide space the other slips use so the shared
// PrintPage maps it onto the 8x4in sheet. All coordinates below are measured
// off the high-resolution scan of the printed slip.
const PAGE_W = 850
const PAGE_H = 458

// Thin printed border around the entire slip
const FRAME = { left: 14, top: 10, width: 822, height: 438 }

// Header prints on WHITE paper — only two elements are solid green fills:
// each capacity stack's "TON" strip, and the "FULLY COMPUTERISED WEIGHBRIDGE"
// subtitle band. Everything else (title, numerals, CAPACITY) is green ink on
// white, with the numeral/CAPACITY boxes drawn as thin green outlines.
const HEAD = { left: 28, top: 22, width: 786, height: 88 }

// Capacity stacks at the far left / right of the header. Each is ONE
// continuous outlined rectangle — the numeral, the solid TON band and
// CAPACITY are rows inside it, so the outline never breaks.
const CAP_W = 94
const CAP_L = HEAD.left + 4                       // 10 / TON / CAPACITY
const CAP_R = HEAD.left + HEAD.width - CAP_W - 4  // 100 / TON / CAPACITY
const CAP = { top: 4, height: 84 }         // the full bordered stack
const CAP_NUM_H = 40                       // numeral row (white)
const CAP_TON_H = 22                       // SOLID green band, white "TON"

// Centre column: green title on white, then the solid green subtitle band
const MID = { left: HEAD.left + CAP_W + 12, width: HEAD.width - 2 * (CAP_W + 12) }
const TITLE_TOP = 2
const SUB = { top: 46, height: 24 }

// Address lines print on white paper beneath the subtitle band
const ADDR_TOP = 113

// Fields box frame — positioning container for every dynamic value.
// Spans the same inner width as the header panel.
const BOX = { left: 28, top: 146, width: 786, height: 152 }

// Row Y centers inside the fields box (box-relative)
const ROW = { gross: 70, tare: 105, net: 138 }
// Column X positions inside the fields box
const COL = {
  icon: 10, label: 56, value: 180, kg: 268, date: 302, dateVal: 380,
  time: 524, timeVal: 612, chargesLbl: 490, chargesVal: 660,
  rLbl: 495, rColon: 600, rVal: 616,
}

// GOVERNMENT APPROVED / 24 HOURS SERVICE boxes — together they span the full
// inner width, meeting at a shared vertical divider as on the stationery
const BANNER = { top: 303, height: 34 }
const BANNER_L = { left: BOX.left, width: 392 }
const BANNER_R = { left: BOX.left + 392, width: BOX.width - 392 }

const NOTES_TOP = 345
const NOTES_STEP = 14.5

const S = StyleSheet.create({
  frame: { position: 'absolute', ...FRAME, border: `2 solid ${INK}` },

  // ---- header ----
  // Only TON strips and the subtitle band are filled; the rest is ink on white.
  // one continuous outline; rows stack inside it with no gaps
  capBox: { position: 'absolute', border: `2 solid ${INK}` },
  capNum: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },
  capTonTxt: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center' },
  capCapTxt: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },

  // masthead: green ink on white paper
  title: {
    position: 'absolute', left: MID.left, width: MID.width, top: HEAD.top + TITLE_TOP,
    fontSize: 36, fontFamily: 'Times-Bold', color: INK, textAlign: 'center',
  },
  subBand: { position: 'absolute', backgroundColor: INK, justifyContent: 'center' },
  subBandTxt: { fontSize: 16.5, fontFamily: 'Helvetica-Bold', color: PAPER, textAlign: 'center', letterSpacing: 0.3 },
  addr: {
    position: 'absolute', left: HEAD.left, width: HEAD.width,
    fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center',
  },

  // ---- fields ----
  lbl: { position: 'absolute', fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontSize: 15, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },
  // the weighing software prints the weight figures enlarged
  wVal: { position: 'absolute', fontSize: 19, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1.5 },
  icon: { position: 'absolute' },

  // ---- banners ----
  bannerBox: {
    position: 'absolute', top: BANNER.top, height: BANNER.height,
    border: `2.5 solid ${INK}`, alignItems: 'center', justifyContent: 'center',
  },
  bannerSerif: { fontSize: 22, fontFamily: 'Times-Bold', color: INK, letterSpacing: 1 },
  bannerSans: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: INK, letterSpacing: 1 },

  // ---- notes ----
  // fontWeight 400 throughout for Gujarati: the bundled Noto Sans Gujarati
  // *Bold* is missing a mark anchor for the U+0A85 U+0A82 ("અં") cluster, and
  // fontkit throws "Cannot read properties of null (reading 'xCoordinate')"
  // while shaping it. That cluster occurs in these notes ("અંદર"). The Regular
  // face shapes it correctly, and also matches the single-colour press print
  // more closely than a synthetic bold. DhartiSlip/JaySlip use 400 likewise.
  noteRow: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  gujLead: { fontSize: 12, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  guj: { fontSize: 11, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  bullet: { width: 6, height: 6, backgroundColor: INK, marginRight: 6 },
  jurisdiction: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: INK },
  sig: { position: 'absolute', fontSize: 17, fontFamily: 'Helvetica', color: INK },
})

// Dot-matrix loaded truck (GROSS) — same drawing as the Dharti slip
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

// NETT icon — two rows of three dashes, as on the printed slip
function NettDashesIcon() {
  const segs = []
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++)
      segs.push(<Rect key={`s${r}-${c}`} x={c * 13} y={r * 8} width={10} height={5} fill={INK} />)
  return (
    <Svg viewBox="0 0 36 13" width={36} height={13}>
      {segs}
    </Svg>
  )
}

// 10 / 100 TON CAPACITY stack — a single unbroken outlined rectangle holding
// three rows: green numeral on white, a solid green TON band spanning the full
// inner width (white text), then CAPACITY in green on white.
function CapacityBlock({ left, num }) {
  return (
    <View style={[S.capBox, { left, top: HEAD.top + CAP.top, width: CAP_W, height: CAP.height }]}>
      <View style={{ height: CAP_NUM_H, justifyContent: 'center' }}>
        <Text style={S.capNum}>{num}</Text>
      </View>
      <View style={{ height: CAP_TON_H, backgroundColor: INK, justifyContent: 'center' }}>
        <Text style={S.capTonTxt}>TON</Text>
      </View>
      <View style={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={S.capCapTxt}>CAPACITY</Text>
      </View>
    </View>
  )
}

// Static half of a weigh row
function WeighRowLabels({ y, icon, label, date, time }) {
  return (
    <>
      <View style={[S.icon, { left: COL.icon, top: y - 14 }]}>{icon}</View>
      <Text style={[S.lbl, { left: COL.label, top: y - 7 }]}>{label}</Text>
      <Text style={[S.lbl, { left: COL.kg, top: y - 7 }]}>Kg.</Text>
      {date && <Text style={[S.lbl, { left: COL.date, top: y - 7 }]}>DATE :</Text>}
      {time && <Text style={[S.lbl, { left: COL.time, top: y - 7 }]}>TIME :</Text>}
    </>
  )
}

// Dynamic half of a weigh row; the weight figure prints enlarged
function WeighRowValues({ y, value, date, dateVal, time, timeVal, color }) {
  return (
    <>
      <Text style={[S.wVal, { left: COL.value, top: y - 10, color }]}>{value || ' '}</Text>
      {date && <Text style={[S.val, { left: COL.dateVal, top: y - 8, color }]}>{dateVal || ' '}</Text>}
      {time && <Text style={[S.val, { left: COL.timeVal, top: y - 8, color }]}>{timeVal || ' '}</Text>}
    </>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (this slip prints slashes)
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// This slip prints plain 24h 'HH:MM' — the form value passes through as-is
const fmtTime = (t) => t

// Notes transcribed from the scan (Gujarati, square bullets, સૂચના: lead)
const NOTE_LINES = [
  'વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તથા ગાડી નંબર તપાસી લેવા.',
  'વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.',
  'ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.',
  'ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.',
  'વજન કરતી વખતે પાર્ટીએ વજન કાંટા પર શૂન્ય તપાસી, લીધા બાદ ગાડી ચડાવવી.',
  'વજન કરતી વખતે પાર્ટીએ ગાડી માંથી ડ્રાઈવર તથા મજૂરો ઉતરી ગયા બાદ જ વજનની નોંધ લેવી.',
]

// mode: 'full' (design + values), 'blank' (pre-print stationery master),
//       'values' (dot-matrix overlay: white page, values only, black ink)
export default function MarutiSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
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

            {/* ---- Header: green ink on white paper ---- */}
            <Text style={S.title}>SHREE MARUTI WEIGHBRIDGE</Text>

            {/* Solid green band carrying the reversed subtitle */}
            <View style={[S.subBand, { left: MID.left, top: HEAD.top + SUB.top, width: MID.width, height: SUB.height }]}>
              <Text style={S.subBandTxt}>FULLY COMPUTERISED WEIGHBRIDGE</Text>
            </View>

            <CapacityBlock left={CAP_L} num="10" />
            <CapacityBlock left={CAP_R} num="100" />

            {/* Address prints on white paper below the panel */}
            <Text style={[S.addr, { top: ADDR_TOP }]}>Maruti Industrial Plot No.-1, Near Maladhari Railway Crossing</Text>
            <Text style={[S.addr, { top: ADDR_TOP + 16 }]}>Before Rolex Bearing, Kothariya, Rajkot</Text>
          </>
        )}

        {/* Fields box — frame belongs to the stationery, the View is the
            positioning container for all values in every mode */}
        <View style={[
          { position: 'absolute', ...BOX },
          showStatic ? { border: `2 solid ${INK}` } : null,
        ]}>
          {showStatic && (
            <>
              <Text style={[S.lbl, { left: 16, top: 7 }]}>SERIAL No.</Text>
              <Text style={[S.lbl, { left: 112, top: 7 }]}>:</Text>
              <Text style={[S.lbl, { left: 16, top: 26 }]}>PARTY</Text>
              <Text style={[S.lbl, { left: 112, top: 26 }]}>:</Text>
              <Text style={[S.lbl, { left: COL.rLbl, top: 15 }]}>VEHICLE No.</Text>
              <Text style={[S.lbl, { left: COL.rColon, top: 15 }]}>:</Text>
              <Text style={[S.lbl, { left: COL.rLbl, top: 36 }]}>MATERIAL</Text>
              <Text style={[S.lbl, { left: COL.rColon, top: 36 }]}>:</Text>

              <WeighRowLabels y={ROW.gross} icon={<TruckLoadedIcon />} label="GROSS :" date time />
              <WeighRowLabels y={ROW.tare} icon={<TruckEmptyIcon />} label="TARE :" date time />
              <WeighRowLabels y={ROW.net} icon={<NettDashesIcon />} label="NETT :" />
            </>
          )}

          {showValues && (
            <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: BOX.width, height: BOX.height }}>
              <Text style={[S.val, { left: 136, top: 6, color: vColor }]}>{data.serialNo || ' '}</Text>
              <Text style={[S.val, { left: 136, top: 25, color: vColor }]}>{data.party || ' '}</Text>
              <Text style={[S.val, { left: COL.rVal, top: 14, color: vColor }]}>{data.vehicleNo || ' '}</Text>
              <Text style={[S.val, { left: COL.rVal, top: 35, color: vColor }]}>{data.material || ' '}</Text>

              <WeighRowValues y={ROW.gross} value={data.gross} date dateVal={fmtDate(data.grossDate)} time timeVal={fmtTime(data.grossTime)} color={vColor} />
              <WeighRowValues y={ROW.tare} value={data.tare} date dateVal={fmtDate(data.tareDate)} time timeVal={fmtTime(data.tareTime)} color={vColor} />
              <WeighRowValues y={ROW.net} value={data.net} color={vColor} />

              {/* The real system dot-matrix-prints the Charges label along with
                  the amount — it is not part of the pre-printed stationery */}
              {data.charges ? (
                <>
                  <Text style={[S.val, { left: COL.chargesLbl, top: ROW.net - 8, color: vColor }]}>Charges(Rs):</Text>
                  <Text style={[S.val, { left: COL.chargesVal, top: ROW.net - 8, color: vColor }]}>{data.charges}</Text>
                </>
              ) : null}
            </View>
          )}
        </View>

        {showStatic && (
          <>
            {/* GOVERNMENT APPROVED / 24 HOURS SERVICE — one full-width box
                split by a shared divider, so the pair reaches both edges */}
            <View style={[S.bannerBox, BANNER_L, { borderRightWidth: 1.25 }]}>
              <Text style={S.bannerSerif}>* GOVERNMENT APPROVED *</Text>
            </View>
            <View style={[S.bannerBox, BANNER_R, { borderLeftWidth: 1.25 }]}>
              <Text style={S.bannerSans}>* 24 HOURS SERVICE *</Text>
            </View>

            {/* Notes block */}
            <View style={[S.noteRow, { left: 40, top: NOTES_TOP }]}>
              <Text style={S.gujLead}>{'સૂચના: '}</Text>
              <View style={S.bullet} />
              <Text style={S.guj}>{NOTE_LINES[0]}</Text>
            </View>
            {NOTE_LINES.slice(1).map((line, i) => (
              <View key={i} style={[S.noteRow, { left: 66, top: NOTES_TOP + (i + 1) * NOTES_STEP }]}>
                <View style={S.bullet} />
                <Text style={S.guj}>{line}</Text>
              </View>
            ))}
            <View style={[S.noteRow, { left: 66, top: NOTES_TOP + 6 * NOTES_STEP - 1 }]}>
              <View style={S.bullet} />
              <Text style={S.jurisdiction}>Subject to Rajkot Jurisdiction only</Text>
            </View>

            <Text style={[S.sig, { left: 650, top: 422 }]}>Operator's Signature</Text>
          </>
        )}

      </PrintPage>
    </Document>
  )
}
