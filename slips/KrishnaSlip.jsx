import React from 'react'
import { Document, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import '../fonts.js'
import krishnaArt from '../krishnaArt.js'
import krishnaLogo from '../krishnaLogo.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original Krishna Metals slip photo (normalized for clean print)
const INK = '#e14b2a'
const PAPER = '#fde9dc'
const CELL = '#fdf6ef'
const VAL = '#6f6a66'

const PAGE_W = 850
const PAGE_H = 600

// Outer printed border (content is shifted inside it)
const B = { left: 74, top: 19, right: 803, bottom: 592 }
// Horizontal shift applied to all content so it sits inside the border
const SHIFT = 46

// Main table geometry (pre-shift page units)
const T = { left: 44, top: 168, right: 741, bottom: 454 }
const ROW1 = 213 // under વેચનાર
const ROW2 = 241 // under ખરીદનાર
const ROW3 = 385 // above રીમાર્ક
const ROW4 = 421 // above તોલાઈ ચાર્જ
const MID_L = 346 // middle column left
const MID_R = 454 // middle column right
const MID1 = 295 // સબારદાન / બારદાન divider
const MID2 = 338 // બારદાન / નેટ વજન divider
const LEFT_DIV = 313 // મીલની જાત / માલ વાહક divider
const BW = 2.2

const S = StyleSheet.create({
  gujB: { position: 'absolute', fontFamily: 'NotoGujarati', fontWeight: 700, color: INK },
  guj: { position: 'absolute', fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  latB: { position: 'absolute', fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontFamily: 'DotMatrix', color: VAL },

  hline: { position: 'absolute', height: BW, backgroundColor: INK },
  vline: { position: 'absolute', width: BW, backgroundColor: INK },
})

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDateSlash = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// Krishna header artwork supplied as an image (cropped, background keyed transparent)
function KrishnaArtIcon() {
  return <Image src={krishnaArt} style={{ width: 100, height: 105 }} />
}

// mode: 'full' | 'blank' (stationery master) | 'values' (dot-matrix overlay)
// offsetX/offsetY (pt): tractor-feed alignment nudge, values layer only
export default function KrishnaSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
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
            <View style={{
              position: 'absolute', left: B.left, top: B.top,
              width: B.right - B.left, height: B.bottom - B.top,
              border: `2.5 solid ${INK}`,
            }} />

            {/* All static slip content, shifted inside the border */}
            <View style={{ position: 'absolute', left: SHIFT, top: 0, width: PAGE_W, height: PAGE_H }}>

              {/* Top line */}
              <View style={{ position: 'absolute', left: 86, top: 38, flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'NotoGujarati', fontWeight: 700, fontSize: 12.5, color: INK }}>૧૦ ટન કેપેસીટી </Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12.5, color: INK, marginTop: 2 }}>2 Kg. </Text>
                <Text style={{ fontFamily: 'NotoGujarati', fontWeight: 700, fontSize: 12.5, color: INK }}>સ્કેલ</Text>
              </View>
              <Text style={[S.gujB, { left: 472, top: 42, width: 270, fontSize: 14.5, textAlign: 'center' }]}>ઇલેક્ટ્રોનિકસ (એવરી ઇન્ડીયા)</Text>

              {/* No. / Date block */}
              <Text style={[S.latB, { left: 53, top: 62, fontSize: 21 }]}>No.</Text>
              <Text style={[S.latB, { left: 53, top: 107, fontSize: 21 }]}>Date :</Text>

              {/* Header: Krishna art + title + address */}
              <View style={{ position: 'absolute', left: 326, top: 60 }}>
                <KrishnaArtIcon />
              </View>
              <Text style={[S.gujB, { left: 420, top: 64, width: 332, fontSize: 37, letterSpacing: 1, textAlign: 'center' }]}>ક્રિષ્ના વે-બ્રીજ</Text>
              <Text style={[S.gujB, { left: 420, top: 112, width: 332, fontSize: 13, textAlign: 'center' }]}>૪, મવડી પ્લોટ કોર્નર, રાજકોટ-૩૬૦૦૦૪.</Text>
              <Text style={[S.gujB, { left: 500, top: 132, width: 252, fontSize: 13.5, textAlign: 'center' }]}>મો. ૯૭૨૪૯ ૬૪૫૯૪</Text>

              {/* ---- Main table ---- */}
              {/* white cell fills (whole table is white, like the printed slip) */}
              <View style={{ position: 'absolute', left: T.left, top: T.top, width: T.right - T.left, height: ROW2 - T.top, backgroundColor: CELL }} />
              <View style={{ position: 'absolute', left: T.left, top: ROW2, width: T.right - T.left, height: ROW3 - ROW2, backgroundColor: CELL }} />
              <View style={{ position: 'absolute', left: T.left, top: ROW3, width: T.right - T.left, height: T.bottom - ROW3, backgroundColor: CELL }} />
              {/* outer border */}
              <View style={{ position: 'absolute', left: T.left, top: T.top, width: T.right - T.left, height: T.bottom - T.top, border: `${BW} solid ${INK}` }} />
              {/* horizontal rules */}
              <View style={[S.hline, { left: T.left, top: ROW1, width: T.right - T.left }]} />
              <View style={[S.hline, { left: T.left, top: ROW2, width: T.right - T.left }]} />
              {/* ROW3 stops at the middle column's right edge — the weight zone stays open down to ROW4 */}
              <View style={[S.hline, { left: T.left, top: ROW3, width: MID_R - T.left }]} />
              <View style={[S.hline, { left: T.left, top: ROW4, width: T.right - T.left }]} />
              <View style={[S.hline, { left: T.left, top: LEFT_DIV, width: MID_L - T.left }]} />
              <View style={[S.hline, { left: MID_L, top: MID1, width: MID_R - MID_L }]} />
              <View style={[S.hline, { left: MID_L, top: MID2, width: MID_R - MID_L }]} />
              {/* vertical rules (3-col zone only) */}
              <View style={[S.vline, { left: MID_L, top: ROW2, height: ROW3 - ROW2 }]} />
              <View style={[S.vline, { left: MID_R, top: ROW2, height: ROW3 - ROW2 }]} />

              {/* row labels */}
              <Text style={[S.gujB, { left: 52, top: 178, fontSize: 14.5 }]}>વેચનાર :</Text>
              <Text style={[S.gujB, { left: 52, top: 214, fontSize: 14.5 }]}>ખરીદનાર :</Text>
              <Text style={[S.gujB, { left: 52, top: 246, fontSize: 14.5 }]}>મીલની જાત :</Text>
              <Text style={[S.gujB, { left: 52, top: 318, fontSize: 14.5 }]}>માલ વાહક :</Text>

              {/* middle column cells */}
              <Text style={[S.gujB, { left: MID_L, top: 246, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }]}>સબારદાન</Text>
              <Text style={[S.latB, { left: MID_L, top: 272, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }]}>Kg.</Text>
              <Text style={[S.gujB, { left: MID_L, top: 299, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }]}>બારદાન</Text>
              <Text style={[S.latB, { left: MID_L, top: 318, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }]}>Kg.</Text>
              <Text style={[S.gujB, { left: MID_L, top: 341, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }]}>નેટ વજન</Text>
              <Text style={[S.latB, { left: MID_L, top: 362, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }]}>Kg.</Text>

              <Text style={[S.gujB, { left: 52, top: 390, fontSize: 14.5 }]}>રીમાર્ક :</Text>
              <Text style={[S.gujB, { left: 52, top: 426, fontSize: 14.5 }]}>તોલાઈ ચાર્જ :</Text>
              <Text style={[S.gujB, { left: 390, top: 426, fontSize: 14.5 }]}>તોલનાર :</Text>

              {/* request / note line */}
              <Text style={[S.guj, { left: 38, top: 464, fontSize: 11, fontWeight: 700 }]}>વિનંતી : વે-બ્રીજથી નિકળ્યા બાદ વજનમાં થતા ફેરફાર માટે વે-બ્રીજ જવાબદાર નથી. બાદબાકી તથા વજન ચકાસી લેવા.</Text>

              {/* ---- Footer: Krishna Metals logo lockup (supplied artwork) ---- */}
              <Image src={krishnaLogo} style={{ position: 'absolute', left: 50, top: 486, width: 340, height: 99 }} />

              {/* right footer block */}
              <Text style={[S.latB, { left: 420, top: 498, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }]}>SPECIALIST IN : ALL TYPES OF HEAVY</Text>
              <Text style={[S.latB, { left: 420, top: 515, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }]}>ALLUMINIUM CASTING &amp; PLATES CASTING FOR DIE</Text>
              <View style={[S.hline, { left: 420, top: 537, width: T.right - 420, height: 1.5 }]} />
              <Text style={[S.latB, { left: 420, top: 543, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }]}>4, Mavdi Plot, Tanti Road, Opp. Saurastra</Text>
              <Text style={[S.latB, { left: 420, top: 560, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }]}>Besan Mill, RAJKOT - 360 004. PH. 2365348</Text>

            </View>
          </>
        )}

        {/* Values layer — same SHIFT as the static content, plus the feed nudge.
            The weight values keep their width/textAlign/letterSpacing verbatim:
            they are centered inside the open table zone and would slide otherwise. */}
        {showValues && (
          <View style={{ position: 'absolute', left: SHIFT + offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            <Text style={[S.val, { left: 130, top: 96, fontSize: 19, letterSpacing: 2, color: vColor }]}>{data.serialNo || ' '}</Text>
            <Text style={[S.val, { left: 130, top: 140, fontSize: 19, letterSpacing: 2, color: vColor }]}>{fmtDateSlash(data.grossDate) || ' '}</Text>
            <Text style={[S.val, { left: 160, top: 184, fontSize: 15, letterSpacing: 2, color: vColor }]}>{data.party || ' '}</Text>
            <Text style={[S.val, { left: 170, top: 218, fontSize: 15, letterSpacing: 2, color: vColor }]}>{data.supplierName || ' '}</Text>
            <Text style={[S.val, { left: 54, top: 288, fontSize: 16, letterSpacing: 2, color: vColor }]}>{data.material || ' '}</Text>
            <Text style={[S.val, { left: 54, top: 352, fontSize: 17, letterSpacing: 2, color: vColor }]}>{data.vehicleNo || ' '}</Text>
            <Text style={[S.val, { left: MID_R, top: 256, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center', color: vColor }]}>{data.gross || ' '}</Text>
            <Text style={[S.val, { left: MID_R + 40, top: 310, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center', color: vColor }]}>{data.tare || ' '}</Text>
            <Text style={[S.val, { left: MID_R + 30, top: 346, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center', color: vColor }]}>{data.net || ' '}</Text>
            <Text style={[S.val, { left: 150, top: 394, fontSize: 15, letterSpacing: 2, color: vColor }]}>{data.remark || ' '}</Text>
            <Text style={[S.val, { left: 172, top: 428, fontSize: 16, letterSpacing: 2, color: vColor }]}>{data.charges || ' '}</Text>
            <Text style={[S.val, { left: 478, top: 428, fontSize: 16, letterSpacing: 4, color: vColor }]}>{(data.weigherName || ' ').toUpperCase()}</Text>
          </View>
        )}

      </PrintPage>
    </Document>
  )
}
