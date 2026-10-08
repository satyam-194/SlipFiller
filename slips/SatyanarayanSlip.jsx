import React from 'react'
import { Document, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import '../fonts.js'
import PrintPage from './printSpec.jsx'
import satyanarayanTitle, { satyanarayanTitleAspect } from '../satyanarayanTitle.js'

// Color palette matched from satyanarayan.jpeg scan
const INK = '#982435'          // Deep crimson red press ink
const HEADER_BG = '#f0bcc5'    // Soft dusty pink screened tint for header band & slip body
const FOOTER_BG = '#f0bcc5'    // Soft dusty pink screened tint for footer band
const PAPER = '#ffffff'        // Pure white continuous paper for center container
const VAL = '#1a1a1a'          // Dark charcoal for values

const PAGE_W = 850
const PAGE_H = 458

// Rendered width of the title lettering image (height follows its aspect)
const TITLE_W = 560

const S = StyleSheet.create({
  // Main red border without radius + pink background inside
  outerBorder: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: PAGE_W - 24,
    height: PAGE_H - 24,
    border: `2 solid ${INK}`,
    borderRadius: 0,
    backgroundColor: HEADER_BG,
  },

  // Side metric ton boxes (same background color as main background)
  sideBox: {
    position: 'absolute',
    top: 20,
    width: 80,
    height: 86,
    border: `1.8 solid ${INK}`,
    borderRadius: 8,
    backgroundColor: HEADER_BG,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideNum50: {
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    lineHeight: 1,
  },
  sideNum5: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    lineHeight: 1,
  },
  sideMatric: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    marginTop: 3,
    letterSpacing: 0.6,
  },
  sideTon: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    marginTop: 1,
    letterSpacing: 0.6,
  },

  // Center header texts
  headerCenter: {
    position: 'absolute',
    left: 110,
    top: 18,
    width: 630,
    alignItems: 'center',
  },
  titleImg: {
    width: TITLE_W,
    height: TITLE_W / satyanarayanTitleAspect,
    objectFit: 'contain',
  },
  address1: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  address2: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  subTitle: {
    fontSize: 13.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 1.2,
  },

  // Main center container (White background color)
  centerContainer: {
    position: 'absolute',
    left: 14,
    top: 116,
    width: PAGE_W - 28,
    height: 232,
    backgroundColor: PAPER,
  },

  // ---- Fields box labels ----
  lbl: {
    position: 'absolute',
    fontSize: 13.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
  },
  val: {
    position: 'absolute',
    fontSize: 13.5,
    fontFamily: 'DotMatrix',
    letterSpacing: 1,
  },
  // Condensed pitch (the printer's 17 CPI mode) for the VEHICLE NO. run: a
  // 13-char registration from x=680 is 188pt at the normal size and would end
  // at 868, well past the 850 canvas. At 9.5/0.2 it is 126pt and ends at 806.
  valNarrow: {
    position: 'absolute',
    fontSize: 9.5,
    fontFamily: 'DotMatrix',
    letterSpacing: 0.2,
  },

  // Gujarati terms
  noteRow: {
    position: 'absolute',
    left: 24,
  },
  gujText: {
    fontSize: 11,
    fontFamily: 'NotoGujarati',
    fontWeight: 500,
    color: INK,
    lineHeight: 1.2,
  },
  jurisdictionText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    lineHeight: 1.2,
  },

  opSig: {
    position: 'absolute',
    left: 540,
    top: 412,
    fontSize: 12.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
  },

  // Service 24 Hours box (same pink background as footer/header)
  serviceBox: {
    position: 'absolute',
    left: 746,
    top: 355,
    width: 78,
    height: 82,
    border: `1.8 solid ${INK}`,
    borderRadius: 8,
    backgroundColor: FOOTER_BG,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTxt: {
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    lineHeight: 1,
  },
  serviceNum: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    lineHeight: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  hoursTxt: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textAlign: 'center',
    lineHeight: 1,
  },

  // Offset printer credit rotated outside the main border part
  credit: {
    position: 'absolute',
    left: 838,
    top: 438,          // run ends just inside the bottom border (border spans y 12..446)
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    transform: 'rotate(-90deg)',
    transformOrigin: '0 0',
  },
})

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

export default function SatyanarayanSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  const supplierValue = data.supplierName || data.party || ''

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>
        {showStatic && (
          <>
            {/* Main red border without radius + pink background */}
            <View style={S.outerBorder} />

            {/* Left Box: 50 MATRIC TON (same background as main background) */}
            <View style={[S.sideBox, { left: 24 }]}>
              <Text style={S.sideNum50}>50</Text>
              <Text style={S.sideMatric}>MATRIC</Text>
              <Text style={S.sideTon}>TON</Text>
            </View>

            {/* Right Box: 5 MATRIC TON (same background as main background) */}
            <View style={[S.sideBox, { left: 746 }]}>
              <Text style={S.sideNum5}>5</Text>
              <Text style={S.sideMatric}>MATRIC</Text>
              <Text style={S.sideTon}>TON</Text>
            </View>

            {/* Center Header Details */}
            <View style={S.headerCenter}>
              <Image src={satyanarayanTitle} style={S.titleImg} />
              <Text style={S.address1}>SAMRAT INDUSTRIAL AREA 10/13 CORNER, GONDAL ROAD,</Text>
              <Text style={S.address2}>B/H. S.T. WORKSHOP, RAJKOT. Mo. 97731 30841</Text>
              <Text style={S.subTitle}>COMPUTERISED WEIGH BRIDGE</Text>
            </View>

            {/* ---- Main Center Container (White Background Color) ---- */}
            <View style={S.centerContainer} />

            {/* ---- Middle Fields Labels ---- */}
            {/* Row 1: RST NO. & VEHICLE NO. */}
            <Text style={[S.lbl, { left: 36, top: 140 }]}>RST NO.  :</Text>
            <Text style={[S.lbl, { left: 540, top: 140 }]}>VEHICLE NO. :</Text>

            {/* Row 2: SUPPLIER & MATERIAL */}
            <Text style={[S.lbl, { left: 36, top: 176 }]}>SUPPLIER :</Text>
            <Text style={[S.lbl, { left: 560, top: 176 }]}>MATERIAL :</Text>

            {/* Row 3: GROSS, DATE, TIME */}
            <Text style={[S.lbl, { left: 36, top: 222 }]}>GROSS :</Text>
            <Text style={[S.lbl, { left: 390, top: 222 }]}>DATE :</Text>
            <Text style={[S.lbl, { left: 610, top: 222 }]}>TIME :</Text>

            {/* Row 4: TARE, DATE, TIME */}
            <Text style={[S.lbl, { left: 36, top: 264 }]}>TARE  :</Text>
            <Text style={[S.lbl, { left: 390, top: 264 }]}>DATE :</Text>
            <Text style={[S.lbl, { left: 610, top: 264 }]}>TIME :</Text>

            {/* Row 5: NET */}
            <Text style={[S.lbl, { left: 36, top: 306 }]}>NET   :</Text>

            {/* ---- Footer Section (Same Pink Background as Header) ---- */}
            {/* Gujarati conditions (exact text transcribed from scan) */}
            <View style={[S.noteRow, { top: 355 }]}>
              <Text style={S.gujText}>* વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            </View>
            <View style={[S.noteRow, { top: 370 }]}>
              <Text style={S.gujText}>* વજન થઈ ગયા પછી અમારી કોઈ પણ જાતની જવાબદારી રહેતી નથી.</Text>
            </View>
            <View style={[S.noteRow, { top: 385 }]}>
              <Text style={S.gujText}>* ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતું નથી.</Text>
            </View>
            <View style={[S.noteRow, { top: 400 }]}>
              <Text style={S.gujText}>* ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.</Text>
            </View>
            <View style={[S.noteRow, { top: 415 }]}>
              <Text style={S.jurisdictionText}>* Subject to Rajkot Jurisdiction</Text>
            </View>

            {/* Operator Signature */}
            <Text style={S.opSig}>Operator Signature</Text>

            {/* Service 24 Hours Box (same pink background as footer/header) */}
            <View style={S.serviceBox}>
              <Text style={S.serviceTxt}>Sevice</Text>
              <Text style={S.serviceNum}>24</Text>
              <Text style={S.hoursTxt}>Hours</Text>
            </View>

            {/* Rotated Jagruti Offset credit outside the main border part */}
            <Text style={S.credit}>Jagruti Offset : 94272 36877</Text>
          </>
        )}

        {/* Dynamic Values (Dot-matrix overlay) */}
        {showValues && (
          <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            {/* Row 1 Values */}
            <Text style={[S.val, { left: 150, top: 140, color: vColor }]}>{data.serialNo || ' '}</Text>
            <Text style={[S.valNarrow, { left: 680, top: 143, color: vColor }]}>{data.vehicleNo || ' '}</Text>

            {/* Row 2 Values */}
            <Text style={[S.val, { left: 150, top: 176, color: vColor }]}>{supplierValue || ' '}</Text>
            <Text style={[S.val, { left: 680, top: 176, color: vColor }]}>{data.material || ' '}</Text>

            {/* Row 3 Values (GROSS) */}
            <Text style={[S.val, { left: 150, top: 222, color: vColor }]}>{data.gross || ' '}</Text>
            <Text style={[S.val, { left: 455, top: 222, color: vColor }]}>{fmtDate(data.grossDate) || ' '}</Text>
            <Text style={[S.val, { left: 680, top: 222, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>

            {/* Row 4 Values (TARE) */}
            <Text style={[S.val, { left: 150, top: 264, color: vColor }]}>{data.tare || ' '}</Text>
            <Text style={[S.val, { left: 455, top: 264, color: vColor }]}>{fmtDate(data.tareDate) || ' '}</Text>
            <Text style={[S.val, { left: 680, top: 264, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>

            {/* Row 5 Values (NET & Charges) */}
            <Text style={[S.val, { left: 150, top: 306, color: vColor }]}>{data.net || ' '}</Text>
            {data.charges ? (
              <Text style={[S.val, { left: 550, top: 306, color: vColor }]}>
                {`Charges(Rs) :   ${data.charges}`}
              </Text>
            ) : null}
          </View>
        )}
      </PrintPage>
    </Document>
  )
}
