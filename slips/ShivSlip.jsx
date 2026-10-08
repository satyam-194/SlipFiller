import React from 'react'
import { Document, Text, View, StyleSheet, Svg, G } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'

// Two-color palette sampled from original printed slip scan
const RED = '#b82434'          // Rich crimson red press ink
const BLUE = '#1b3b6f'         // Deep navy blue press ink
const PAPER = '#fce3f2'        // Pink tinted continuous paper (inside border only)
const VAL = '#1a1a1a'          // Dark charcoal for values

const PAGE_W = 850
const PAGE_H = 458

const S = StyleSheet.create({
  outerBorder: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: PAGE_W - 24,
    height: PAGE_H - 24,
    border: `2 solid ${RED}`,
    borderRadius: 8,
    backgroundColor: PAPER,
  },

  // ---- Header ----
  // Left 24 HOURS SERVICE Box
  leftBox: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 78,
    height: 88,
    border: `1.8 solid ${RED}`,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
  },
  leftNum24: {
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    lineHeight: 1,
    marginTop: 3,
    textAlign: 'center',
  },
  leftDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: RED,
    marginTop: 2,
  },
  leftServiceBand: {
    width: '100%',
    flex: 1,
    backgroundColor: RED,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  leftServiceTxt: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 1.15,
  },

  // Header Center
  headerCenter: {
    position: 'absolute',
    left: 104,
    top: 14,
    width: 642,
    alignItems: 'center',
  },
  blessing: {
    fontSize: 9.5,
    fontFamily: 'NotoGujarati',
    fontWeight: 400,
    color: RED,
    textAlign: 'center',
  },
  titleBanner: {
    width: 520,
    height: 42,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleText: {
    fontSize: 29,
    fontFamily: 'Times-Bold',
    color: '#ffffff',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  sub1: {
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  sub2: {
    fontSize: 9.2,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  sub3: {
    fontSize: 9.2,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginTop: 2,
  },

  // Right 100 TONNES Box (single middle divider, no divider between 100 & TONNES or PLATFORM SIZE & 50x10)
  rightBox: {
    position: 'absolute',
    left: 752,
    top: 20,
    width: 78,
    height: 88,
    border: `1.8 solid ${RED}`,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rightNum100: {
    fontSize: 27,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textAlign: 'center',
    lineHeight: 1,
    marginTop: 3,
  },
  rightTonnes: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 1,
    marginBottom: 2,
  },
  rightMiddleDivider: {
    width: '100%',
    height: 1.2,
    backgroundColor: RED,
  },
  rightPlatformSize: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  rightSize: {
    fontSize: 16.5,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    lineHeight: 1,
    marginTop: 1,
    marginBottom: 2,
  },

  // ---- Center Main Content Box ----
  centerBox: {
    position: 'absolute',
    left: 20,
    top: 122,
    width: PAGE_W - 40,
    height: 218,
    border: `1.8 solid ${RED}`,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  // Field Labels inside Center Box
  lbl: {
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: RED,
  },
  val: {
    position: 'absolute',
    fontSize: 13.5,
    fontFamily: 'DotMatrix',
    letterSpacing: 1,
  },

  // ---- Footer Section ----
  footerRulesBox: {
    position: 'absolute',
    left: 20,
    top: 346,
    width: 618,
    height: 86,
    border: `1.8 solid ${RED}`,
    borderRadius: 8,
    backgroundColor: PAPER,
  },
  headingSuchna: {
    position: 'absolute',
    left: 8,
    top: 7,
    fontSize: 10,
    fontFamily: 'NotoGujarati',
    fontWeight: 700,
    color: RED,
  },
  noteRow: {
    position: 'absolute',
    left: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletSquare: {
    width: 4.5,
    height: 4.5,
    backgroundColor: RED,
    marginRight: 5,
  },
  gujText: {
    fontSize: 9,
    fontFamily: 'NotoGujarati',
    fontWeight: 400,
    color: RED,
    lineHeight: 1.25,
  },
  jurisdictionText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    lineHeight: 1.25,
    marginLeft: 5,
  },
  opSig: {
    position: 'absolute',
    right: 14,
    bottom: 8,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: RED,
  },

  // Bottom right dual badges
  badge1: {
    position: 'absolute',
    left: 646,
    top: 346,
    width: 98,
    height: 86,
    border: `1.8 solid ${RED}`,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  badge2: {
    position: 'absolute',
    left: 752,
    top: 346,
    width: 78,
    height: 86,
    border: `1.8 solid ${RED}`,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge2Size: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    lineHeight: 1,
    textAlign: 'center',
  },
  badge2Platform: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 4,
  },
})

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'HH:MM:SS' or 'HH:MM'
const fmtTime = (t) => {
  if (!t) return ''
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    return `${t}:00`
  }
  return t
}

export default function ShivSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  const supplierValue = data.supplierName || data.party || ''

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg="#ffffff" debug={debug}>
        {showStatic && (
          <>
            {/* Outer red border (with PAPER background inside only) */}
            <View style={S.outerBorder} />

            {/* Left Box: 24 HOURS SERVICE */}
            <View style={S.leftBox}>
              <Text style={S.leftNum24}>24</Text>
              <View style={S.leftDivider} />
              <View style={S.leftServiceBand}>
                <Text style={S.leftServiceTxt}>HOURS</Text>
                <Text style={S.leftServiceTxt}>SERVICE</Text>
              </View>
            </View>

            {/* Header Center Details */}
            <View style={S.headerCenter}>
              <Text style={S.blessing}>॥ જયશ્રી કૃષ્ણ ॥</Text>
              <View style={S.titleBanner}>
                <Text style={S.titleText}>SHIV WEIGH-BRIDGE</Text>
              </View>
              <Text style={S.sub1}>FULLY ELECTRONIC COMPUTERISED WEIGH BRIDGE</Text>
              <Text style={S.sub2}>8-B, NATIONAL HIGHWAY, NEAR P.S. PLYWOOD, SHAPAR(VERAVAL) DIST. RAJKOT.</Text>
              <Text style={S.sub3}>Mo. 97272 00002 / 98251 17400</Text>
            </View>

            {/* Right Box: 100 TONNES PLATFORM SIZE 50x10 */}
            <View style={S.rightBox}>
              <Text style={S.rightNum100}>100</Text>
              <Text style={S.rightTonnes}>TONNES</Text>
              <View style={S.rightMiddleDivider} />
              <Text style={S.rightPlatformSize}>PLATFORM SIZE</Text>
              <Text style={S.rightSize}>50x10</Text>
            </View>

            {/* Center Main Content Box with Margin and Border Radius */}
            <View style={S.centerBox} />

            {/* Middle Fields Static Labels */}
            {/* Row 1: SERIAL No. & SUPPLIER */}
            <Text style={[S.lbl, { left: 36, top: 136 }]}>SERIAL No.</Text>
            <Text style={[S.lbl, { left: 410, top: 136 }]}>SUPPLIER</Text>

            {/* Row 2: CHARGES Rs. & RECEIVER */}
            <Text style={[S.lbl, { left: 36, top: 164 }]}>CHARGES Rs.</Text>
            <Text style={[S.lbl, { left: 410, top: 164 }]}>RECEIVER</Text>

            {/* Row 3: VEHICLE No. & MATIRIAL */}
            <Text style={[S.lbl, { left: 36, top: 192 }]}>VEHICLE No.</Text>
            <Text style={[S.lbl, { left: 410, top: 192 }]}>MATIRIAL</Text>

            {/* Row 4: GROSS, Kg., DATE, TIME */}
            <Text style={[S.lbl, { left: 36, top: 232 }]}>GROSS</Text>
            <Text style={[S.lbl, { left: 345, top: 232 }]}>Kg.</Text>
            <Text style={[S.lbl, { left: 410, top: 232 }]}>DATE</Text>
            <Text style={[S.lbl, { left: 650, top: 232 }]}>TIME</Text>

            {/* Row 5: TARE, Kg., DATE, TIME */}
            <Text style={[S.lbl, { left: 36, top: 270 }]}>TARE</Text>
            <Text style={[S.lbl, { left: 345, top: 270 }]}>Kg.</Text>
            <Text style={[S.lbl, { left: 410, top: 270 }]}>DATE</Text>
            <Text style={[S.lbl, { left: 650, top: 270 }]}>TIME</Text>

            {/* Row 6: NETT, Kg. */}
            <Text style={[S.lbl, { left: 36, top: 308 }]}>NETT</Text>
            <Text style={[S.lbl, { left: 345, top: 308 }]}>Kg.</Text>

            {/* ---- Footer Section ---- */}
            <View style={S.footerRulesBox}>
              <Text style={S.headingSuchna}>સુચના:</Text>

              <View style={[S.noteRow, { top: 7 }]}>
                <View style={S.bulletSquare} />
                <Text style={S.gujText}>વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
              </View>
              <View style={[S.noteRow, { top: 24 }]}>
                <View style={S.bulletSquare} />
                <Text style={S.gujText}>વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.</Text>
              </View>
              <View style={[S.noteRow, { top: 41 }]}>
                <View style={S.bulletSquare} />
                <Text style={S.gujText}>ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.</Text>
                <View style={[S.bulletSquare, { marginLeft: 10 }]} />
                <Text style={S.jurisdictionText}>Subject to Rajkot Jurisdiction.</Text>
              </View>
              <View style={[S.noteRow, { top: 58 }]}>
                <View style={S.bulletSquare} />
                <Text style={S.gujText}>ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.</Text>
              </View>

              {/* Operator's Signature (without border) */}
              <Text style={S.opSig}>Operator's Signature</Text>
            </View>

            {/* Bottom Right Dual Badges */}
            {/* Badge 1: 5 TONNES (SVG layout, completely inside borders) */}
            <View style={S.badge1}>
              <Svg viewBox="0 0 94 82" width={94} height={82}>
                <Text x={4} y={62} fill={RED} fontSize={58} fontFamily="Helvetica-Bold">
                  5
                </Text>
                <G transform="translate(42, 6) scale(0.48, 2.9)">
                  <Text x={0} y={19} fill={BLUE} fontSize={19} fontFamily="Helvetica-Bold" letterSpacing={0.4}>
                    TONNES
                  </Text>
                </G>
              </Svg>
            </View>

            <View style={S.badge2}>
              <Text style={S.badge2Size}>10 x 6</Text>
              <Text style={S.badge2Platform}>PLATFORM</Text>
            </View>
          </>
        )}

        {/* Dynamic Values Layer (Dot-matrix overlay) */}
        {showValues && (
          <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            {/* Row 1: SERIAL No. & SUPPLIER */}
            <Text style={[S.val, { left: 170, top: 136, color: vColor }]}>{data.serialNo || ' '}</Text>
            <Text style={[S.val, { left: 510, top: 136, color: vColor }]}>{supplierValue || ' '}</Text>

            {/* Row 2: CHARGES Rs. & RECEIVER */}
            <Text style={[S.val, { left: 170, top: 164, color: vColor }]}>{data.charges || ' '}</Text>

            {/* Row 3: VEHICLE No. & MATERIAL */}
            <Text style={[S.val, { left: 170, top: 192, color: vColor }]}>{data.vehicleNo || ' '}</Text>
            <Text style={[S.val, { left: 510, top: 192, color: vColor }]}>{data.material || ' '}</Text>

            {/* Row 4: GROSS, DATE, TIME */}
            <Text style={[S.val, { left: 170, top: 232, color: vColor }]}>{data.gross || ' '}</Text>
            <Text style={[S.val, { left: 480, top: 232, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Text>
            <Text style={[S.val, { left: 710, top: 232, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>

            {/* Row 5: TARE, DATE, TIME */}
            <Text style={[S.val, { left: 170, top: 270, color: vColor }]}>{data.tare || ' '}</Text>
            <Text style={[S.val, { left: 480, top: 270, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Text>
            <Text style={[S.val, { left: 710, top: 270, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>

            {/* Row 6: NETT */}
            <Text style={[S.val, { left: 170, top: 308, color: vColor }]}>{data.net || ' '}</Text>
          </View>
        )}
      </PrintPage>
    </Document>
  )
}
