import React from 'react'
import { Document, Text, View, StyleSheet, Svg, Rect, Circle, Image } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'
import murlidharLogo from '../murlidharLogo.js'
import murlidharWordmark from '../murlidharWordmark.js'

// Color palette accurately matched from murlidhar cropped.jpeg
const BLUE = '#244594'         // Royal/Cobalt Blue press ink
const GOLD = '#cca028'         // Mustard/Amber Gold banner fill
const CREAM = '#f9eb82'        // Soft light yellow tint for header & rules
const VAL = '#1a1a1a'          // Charcoal for dot-matrix values

const PAGE_W = 850
const PAGE_H = 458

// Truck Loaded Icon (GROSS)
function MurlidharTruckLoaded() {
  return (
    <Svg viewBox="0 0 50 28" width={50} height={28}>
      <Rect x={1} y={4} width={34} height={15} fill={BLUE} rx={1} />
      <Rect x={3} y={7} width={30} height={2} fill="#ffffff" />
      <Rect x={3} y={11} width={30} height={2} fill="#ffffff" />
      <Rect x={3} y={15} width={30} height={2} fill="#ffffff" />
      <Rect x={35} y={8} width={13} height={11} fill={BLUE} rx={2} />
      <Rect x={38} y={10} width={6} height={4} fill="#ffffff" rx={1} />
      <Rect x={1} y={19} width={47} height={2.5} fill={BLUE} />
      <Circle cx={8} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={16} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={42} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={8} cy={22} r={1.5} fill="#ffffff" />
      <Circle cx={16} cy={22} r={1.5} fill="#ffffff" />
      <Circle cx={42} cy={22} r={1.5} fill="#ffffff" />
    </Svg>
  )
}

// Truck Empty Icon (TARE)
function MurlidharTruckEmpty() {
  return (
    <Svg viewBox="0 0 50 28" width={50} height={28}>
      <Rect x={1} y={15} width={34} height={4} fill={BLUE} />
      <Rect x={35} y={8} width={13} height={11} fill={BLUE} rx={2} />
      <Rect x={38} y={10} width={6} height={4} fill="#ffffff" rx={1} />
      <Rect x={1} y={19} width={47} height={2.5} fill={BLUE} />
      <Circle cx={8} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={16} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={42} cy={22} r={3.5} fill={BLUE} />
      <Circle cx={8} cy={22} r={1.5} fill="#ffffff" />
      <Circle cx={16} cy={22} r={1.5} fill="#ffffff" />
      <Circle cx={42} cy={22} r={1.5} fill="#ffffff" />
    </Svg>
  )
}

// Net 3-Bar Icon (NET)
function MurlidharNetIcon() {
  return (
    <Svg viewBox="0 0 46 18" width={46} height={18}>
      <Rect x={1} y={1} width={12} height={4} fill={BLUE} />
      <Rect x={16} y={1} width={12} height={4} fill={BLUE} />
      <Rect x={31} y={1} width={12} height={4} fill={BLUE} />

      <Rect x={1} y={7} width={12} height={4} fill={BLUE} />
      <Rect x={16} y={7} width={12} height={4} fill={BLUE} />
      <Rect x={31} y={7} width={12} height={4} fill={BLUE} />

      <Rect x={1} y={13} width={12} height={4} fill={BLUE} />
      <Rect x={16} y={13} width={12} height={4} fill={BLUE} />
      <Rect x={31} y={13} width={12} height={4} fill={BLUE} />
    </Svg>
  )
}

const S = StyleSheet.create({
  // Single Main Blue Border with light yellow paper background INSIDE the border only
  mainBorder: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: PAGE_W - 24,
    height: PAGE_H - 24,
    border: `2 solid ${BLUE}`,
    backgroundColor: CREAM,
  },

  // ---- Header Section (with padding from outer border) ----
  // Left Box: CAPACITY & 24 HOUR SERVICE (Enclosed box with padding)
  leftBox: {
    position: 'absolute',
    left: 22,
    top: 20,
    width: 120,
    height: 104,
    border: `1.5 solid ${BLUE}`,
    backgroundColor: BLUE,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  leftCapacityBand: {
    width: '100%',
    height: 50,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCapacityTxt: {
    fontSize: 13.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 1,
  },
  leftCapacitySub: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 1,
    marginTop: 4,
  },
  leftGapLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#ffffff',
  },
  leftServiceBand: {
    width: '100%',
    height: 51,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftServiceTxt: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 1,
  },
  leftServiceSub: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 1,
    marginTop: 3,
  },

  // Center Header Area
  centerHeader: {
    position: 'absolute',
    left: 180,
    top: 18,
    width: 504,
    alignItems: 'center',
  },
  blessingRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  blessingTxt: {
    fontSize: 9.5,
    fontFamily: 'NotoGujarati',
    fontWeight: 700,
    color: BLUE,
  },
  // Masthead. The company name is the real wordmark artwork scanned off the
  // stationery, not type: its serifs, the white keyline around each letter and
  // the uneven ink are particular to the printed form and no font reproduces
  // them. Width is set and height derived from the asset's own 10.256:1 ink
  // aspect ratio — set both from that ratio or the letterforms stretch.
  companyTitle: {
    width: 446,
    height: 446 / 10.256,
    marginTop: 2,
    marginBottom: 1,
  },
  goldBanner: {
    backgroundColor: GOLD,
    paddingHorizontal: 26,
    paddingVertical: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1.5,
  },
  goldBannerTxt: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 2.5,
    textAlign: 'center',
    lineHeight: 1,
  },
  addressTxt: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginTop: 1.5,
  },
  phoneTxt: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 1.5,
  },

  // Right Header: Official Logo & Group Badge with padding
  logoImg: {
    position: 'absolute',
    left: 727,
    top: 16,
    width: 78,
    height: 78,
  },
  rightBadge: {
    position: 'absolute',
    left: 708,
    top: 96,
    width: 120,
    height: 28,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBadgeTxt: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 1.15,
  },

  // ---- Main Center Content Box (Enclosed with Blue Border and White Background) ----
  centerBox: {
    position: 'absolute',
    left: 22,
    top: 124,
    width: 806,
    height: 212,
    border: `1.5 solid ${BLUE}`,
    backgroundColor: '#ffffff',
  },

  // Center Background Watermark
  watermarkWrap: {
    position: 'absolute',
    left: 338,
    top: 145,
    width: 170,
    height: 170,
    opacity: 0.10,
  },

  // Static Labels & Values
  lbl: {
    position: 'absolute',
    fontSize: 12.5,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
  },
  val: {
    position: 'absolute',
    fontSize: 13.5,
    fontFamily: 'DotMatrix',
    letterSpacing: 1,
  },
  // Condensed pitch (the printer's 17 CPI mode) for the VEHICLE No. run: a
  // 13-char registration from x=650 is 188pt at the normal size and would end
  // at 838, past the 850 canvas once the frame is allowed for.
  valNarrow: {
    position: 'absolute',
    fontSize: 11,
    fontFamily: 'DotMatrix',
    letterSpacing: 0.4,
  },

  // Weigh Rows
  iconWrap: {
    position: 'absolute',
    left: 32,
  },
  wLbl: {
    position: 'absolute',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
  },
  unitKg: {
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
  },

  // ---- Rules Section (y: 338 to 396, with padding from outer border) ----
  rulesBg: {
    position: 'absolute',
    left: 22,
    top: 338,
    width: 806,
    height: 58,
    backgroundColor: CREAM,
  },
  rulesHeading: {
    position: 'absolute',
    left: 26,
    top: 342,
    fontSize: 10.5,
    fontFamily: 'NotoGujarati',
    fontWeight: 700,
    color: BLUE,
  },
  rulesRow: {
    position: 'absolute',
    left: 72,
    width: 756,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: BLUE,
    marginRight: 5,
  },
  rulesGujTxt: {
    fontSize: 13,
    fontFamily: 'NotoGujarati',
    fontWeight: 700,
    color: BLUE,
    lineHeight: 1.25,
  },
  rulesLatTxt: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: BLUE,
    lineHeight: 1.25,
    marginLeft: 6,
  },

  // ---- Footer Contiguous Bar (y: 402 to 440, with padding from outer border) ----
  footerBar: {
    position: 'absolute',
    left: 22,
    top: 402,
    width: 806,
    height: 38,
    flexDirection: 'row',
    border: `1.5 solid ${BLUE}`,
  },
  footerLeftBox: {
    width: 170,
    height: 37,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLeftTxt1: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 1,
  },
  footerLeftTxt2: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 2,
    lineHeight: 1,
  },

  footerCenterBox: {
    width: 426,
    height: 37,
    backgroundColor: '#ffffff',
    borderLeft: `1.5 solid ${BLUE}`,
    borderRight: `1.5 solid ${BLUE}`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCenterTxt1: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: BLUE,
    textAlign: 'center',
    lineHeight: 1.15,
  },
  footerCenterTxt2: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: BLUE,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 1.15,
  },

  footerRightBox: {
    width: 210,
    height: 37,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRightTxt1: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 1,
  },
  footerRightTxt2: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.4,
    marginTop: 2,
    lineHeight: 1,
  },
})

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'HH:MM'
const fmtTime = (t) => {
  if (!t) return ''
  return t
}

// GROSS / TARE / NET share one right-aligned column ending at 293, 15pt before
// the pre-printed "Kg." unit at 308 (NOT the "DATE :" at 345 — the Kg. comes
// first on this slip). Right-aligning also lines the figures' last digits up
// with each other regardless of digit count.
const WT = { left: 165, width: 128, textAlign: 'right' }

export default function MurlidharSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false, pageMode = 'landscape' }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  const receiverValue = data.party || data.receiver || ''
  const supplierValue = data.supplierName || ''

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg="#ffffff" debug={debug} pageMode={pageMode}>
        {showStatic && (
          <>
            {/* Single Outer Blue Border with light yellow paper background INSIDE the border only */}
            <View style={S.mainBorder} />

            {/* Left Box: CAPACITY 50/5 TONES & 24 HOUR SERVICE (with padding) */}
            <View style={S.leftBox}>
              <View style={S.leftCapacityBand}>
                <Text style={S.leftCapacityTxt}>CAPACITY</Text>
                <Text style={S.leftCapacitySub}>50 / 5 TONES</Text>
              </View>
              <View style={S.leftGapLine} />
              <View style={S.leftServiceBand}>
                <Text style={S.leftServiceTxt}>24 HOUR</Text>
                <Text style={S.leftServiceSub}>SERVICE</Text>
              </View>
            </View>

            {/* Header Center Details */}
            <View style={S.centerHeader}>
              <View style={S.blessingRow}>
                <Text style={S.blessingTxt}>॥ રામ ॥</Text>
                <Text style={S.blessingTxt}>॥ જયશ્રી કૃષ્ણ ॥</Text>
                <Text style={S.blessingTxt}>॥ રામ ॥</Text>
              </View>
              {/* MURLIDHAR masthead — wordmark artwork, not type */}
              <Image src={murlidharWordmark} style={S.companyTitle} />
              {/* WEIGH-BRIDGE in Gold Banner */}
              <View style={S.goldBanner}>
                <Text style={S.goldBannerTxt}>WEIGH-BRIDGE</Text>
              </View>
              {/* Sub Text */}
              <Text style={S.addressTxt}>Plot No. G-920, Kishan Gate Road, Murlidhar Complex, GIDC, METODA.</Text>
              <Text style={S.phoneTxt}>Phone : (02827) 287734 • 90971 77777</Text>
            </View>

            {/* Header Right: Official Logo & Group Badge with padding */}
            <Image src={murlidharLogo} style={S.logoImg} />
            <View style={S.rightBadge}>
              <Text style={S.rightBadgeTxt}>GROUP OF MURLIDHAR</Text>
              <Text style={S.rightBadgeTxt}>WEIGHBRIDGE</Text>
            </View>

            {/* ---- Main Center Content Box (Blue Border & White Background) ---- */}
            <View style={S.centerBox} />

            {/* Center Background Watermark */}
            <Image src={murlidharLogo} style={S.watermarkWrap} />

            {/* Static Labels */}
            {/* Row 1: SR. NO, CHARGES RS., VEHICLE No. */}
            <Text style={[S.lbl, { left: 32, top: 134 }]}>SR. NO</Text>
            <Text style={[S.lbl, { left: 86, top: 134 }]}>:</Text>
            <Text style={[S.lbl, { left: 308, top: 134 }]}>CHARGES RS. :</Text>
            <Text style={[S.lbl, { left: 540, top: 134 }]}>VEHICLE No. :</Text>

            {/* Row 2: RECEIVER, SUPPLIER */}
            <Text style={[S.lbl, { left: 32, top: 162 }]}>RECEIVER :</Text>
            <Text style={[S.lbl, { left: 540, top: 162 }]}>SUPPLIER :</Text>

            {/* Weigh Rows */}
            {/* Row 3: GROSS */}
            <View style={[S.iconWrap, { top: 194 }]}>
              <MurlidharTruckLoaded />
            </View>
            <Text style={[S.wLbl, { left: 92, top: 202 }]}>GROSS</Text>
            <Text style={[S.unitKg, { left: 308, top: 202 }]}>Kg.</Text>
            <Text style={[S.lbl, { left: 345, top: 202 }]}>DATE :</Text>
            <Text style={[S.lbl, { left: 605, top: 202 }]}>TIME</Text>

            {/* Row 4: TARE */}
            <View style={[S.iconWrap, { top: 238 }]}>
              <MurlidharTruckEmpty />
            </View>
            <Text style={[S.wLbl, { left: 92, top: 246 }]}>TARE</Text>
            <Text style={[S.unitKg, { left: 308, top: 246 }]}>Kg.</Text>
            <Text style={[S.lbl, { left: 345, top: 246 }]}>DATE :</Text>
            <Text style={[S.lbl, { left: 605, top: 246 }]}>TIME</Text>

            {/* Row 5: NET */}
            <View style={[S.iconWrap, { top: 286 }]}>
              <MurlidharNetIcon />
            </View>
            <Text style={[S.wLbl, { left: 92, top: 290 }]}>NET</Text>
            <Text style={[S.unitKg, { left: 308, top: 290 }]}>Kg.</Text>
            <Text style={[S.lbl, { left: 540, top: 290 }]}>MATERIAL :</Text>

            {/* Rules Section (with padding) */}
            <View style={S.rulesBg} />
            <Text style={S.rulesHeading}>નિયમો :</Text>
            <View style={[S.rulesRow, { top: 342 }]}>
              <View style={S.bulletDot} />
              <Text style={S.rulesGujTxt}>K -લખેલ હોય તો કહેવાથી ખાલી વજન બાદ કરેલ છે.</Text>
              <View style={[S.bulletDot, { marginLeft: 16 }]} />
              <Text style={S.rulesGujTxt}>વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            </View>
            <View style={[S.rulesRow, { top: 358 }]}>
              <View style={S.bulletDot} />
              <Text style={S.rulesGujTxt}>૨૪ કલાક પહેલાં તોલ થયેલ ખાલી ટ્રક / લારીનો વજન બાદ કરી આપવામાં આવશે નહીં.</Text>
              <View style={[S.bulletDot, { marginLeft: 16 }]} />
              <Text style={S.rulesGujTxt}>વે બ્રીજ ઉપરથી ચાલ્યા ગયા બાદ વજનમાં થતા ફેરફાર માટે</Text>
            </View>
            <View style={[S.rulesRow, { top: 374 }]}>
              <View style={S.bulletDot} />
              <Text style={S.rulesGujTxt}>વે બ્રિજ જવાબદાર નથી.</Text>
              <View style={[S.bulletDot, { marginLeft: 16 }]} />
              <Text style={S.rulesLatTxt}>Subject to rajkot Jurisdiction.</Text>
            </View>

            {/* Footer Contiguous Bar (with padding) */}
            <View style={S.footerBar}>
              {/* Left Box: MADHAV WEIGH BRIDGE */}
              <View style={S.footerLeftBox}>
                <Text style={S.footerLeftTxt1}>MADHAV</Text>
                <Text style={S.footerLeftTxt2}>WEIGH BRIDGE</Text>
              </View>

              {/* Center Box: Krishna Complex */}
              <View style={S.footerCenterBox}>
                <Text style={S.footerCenterTxt1}>Krishna Complex, Gujarat Gas Road, GIDC Metoda.</Text>
                <Text style={S.footerCenterTxt2}>Ph. : 02827 - 286079</Text>
              </View>

              {/* Right Box: Plate Size & Capacity */}
              <View style={S.footerRightBox}>
                <Text style={S.footerRightTxt1}>Plate Size : 10x60</Text>
                <Text style={S.footerRightTxt2}>Capacity : 100 Tonnes</Text>
              </View>
            </View>
          </>
        )}

        {/* Dynamic Values Layer (Dot-matrix overlay) */}
        {showValues && (
          <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            {/* Row 1: SR. NO, CHARGES, VEHICLE No. */}
            <Text style={[S.val, { left: 98, top: 134, color: vColor }]}>{data.serialNo || ' '}</Text>
            <Text style={[S.val, { left: 418, top: 134, color: vColor }]}>{data.charges || ' '}</Text>
            <Text style={[S.valNarrow, { left: 650, top: 136, color: vColor }]}>{data.vehicleNo || ' '}</Text>

            {/* Row 2: RECEIVER, SUPPLIER */}
            <Text style={[S.val, { left: 118, top: 162, color: vColor }]}>{receiverValue || ' '}</Text>
            <Text style={[S.val, { left: 635, top: 162, color: vColor }]}>{supplierValue || ' '}</Text>

            {/* Row 3: GROSS, DATE, TIME */}
            <Text style={[S.val, WT, { top: 202, color: vColor }]}>{data.gross || ' '}</Text>
            <Text style={[S.val, { left: 410, top: 202, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Text>
            <Text style={[S.val, { left: 655, top: 202, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>

            {/* Row 4: TARE, DATE, TIME */}
            <Text style={[S.val, WT, { top: 246, color: vColor }]}>{data.tare || ' '}</Text>
            <Text style={[S.val, { left: 410, top: 246, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Text>
            <Text style={[S.val, { left: 655, top: 246, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>

            {/* Row 5: NET, MATERIAL */}
            <Text style={[S.val, WT, { top: 290, color: vColor }]}>{data.net || ' '}</Text>
            <Text style={[S.val, { left: 645, top: 290, color: vColor }]}>{data.material || ' '}</Text>
          </View>
        )}
      </PrintPage>
    </Document>
  )
}
