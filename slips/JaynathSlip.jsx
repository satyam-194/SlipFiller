import React from 'react'
import { Document, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import '../fonts.js'
import jaynathTitle from '../jaynathTitle.js'
import jaynathWatermark from '../jaynathWatermark.js'
import PrintPage from './printSpec.jsx'

// Palette sampled from the original JAYNATH slip photo (normalized for clean print)
const INK = '#3c5490'
const PAPER = '#f7f6f2'
const TINT = '#d9e0ec'
const VAL = '#55618a'

const PAGE_W = 850
const PAGE_H = 458

const S = StyleSheet.create({
  outerBorder: {
    position: 'absolute', left: 8, top: 20, width: PAGE_W - 16, height: PAGE_H - 28,
    border: `1.5 solid ${INK}`,
  },
  blessing: { position: 'absolute', fontSize: 7, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },

  // side boxes: solid blue square with thin white keyline inset and white text
  sideBox: {
    position: 'absolute', top: 24, width: 92, height: 92,
    backgroundColor: INK, alignItems: 'center', justifyContent: 'center',
  },
  sideKeyline: { position: 'absolute', left: 2.5, top: 2.5, right: 2.5, bottom: 2.5, border: '1.2 solid #ffffff' },
  sideNum: { fontSize: 42, fontFamily: 'Deco', color: '#ffffff', lineHeight: 1 },
  sideNum24: { fontSize: 38, fontFamily: 'Deco', color: '#ffffff', lineHeight: 1 },
  sideSmall: { fontSize: 8.6, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },

  // header center — fixed positions so browser and PDF match exactly
  propBand: { position: 'absolute', left: 211, top: 75, width: 460, height: 20.5, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  propTxt: { color: '#ffffff', fontSize: 12.5, fontFamily: 'Helvetica-Bold' },
  address: { position: 'absolute', left: 178, top: 101.5, width: 526, fontSize: 13, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },

  rule: { position: 'absolute', left: 8, width: PAGE_W - 16, height: 1.5, backgroundColor: INK },

  lbl: { position: 'absolute', fontSize: 13.5, fontFamily: 'Helvetica-Bold', color: INK },
  val: { position: 'absolute', fontSize: 14, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 1 },
  // Condensed pitch (the printer's 17 CPI mode) for the Gross/Tare Date runs:
  // a 10-char date from x=575 is 149pt at the normal size and would end at
  // 724, running under the time that starts at 700. At 11/0.4 it ends at 689.
  valNarrow: { position: 'absolute', fontSize: 11, fontFamily: 'DotMatrix', color: VAL, letterSpacing: 0.4 },

  guj: { position: 'absolute', fontSize: 10.5, fontFamily: 'NotoGujarati', fontWeight: 400, color: INK },
  lat: { position: 'absolute', fontSize: 11.5, fontFamily: 'Helvetica', color: INK },
  fully: { position: 'absolute', fontSize: 14.5, fontFamily: 'Helvetica-Bold', color: INK },
  opSig: { position: 'absolute', fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: INK },
})

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDateSlash = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)
// append '/-' to charges if plain number entered
const fmtCharges = (c) => (c ? (/[/-]\s*$/.test(c) ? c : `${c}/-`) : '')

// 'HH:MM' (24h) -> 'hh:MM AM/PM'
const fmtTime = (t) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t
  const [hs, m] = t.split(':')
  const h = parseInt(hs, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${m.slice(0, 2)} ${ap}`
}

// GROSS / TARE / NET print as one right-aligned column ending at 425, 15pt
// before the "Gross Date" / "Tare Date" / "Charges" label column at 440. These
// figures print at 17pt (larger than the base val), so the column is 210pt wide
// — room for a 6-digit weight. Right-aligning (rather than leaving them
// left-aligned at 215) lines their last digits up whatever the digit count.
const WT = { left: 215, width: 210, textAlign: 'right' }

// mode: 'full' | 'blank' (stationery master) | 'values' (dot-matrix overlay)
// offsetX/offsetY (pt): tractor-feed alignment nudge, values layer only
export default function JaynathSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug}>

        {showStatic && (
          <>
            {/* Header strip tint (runs from the top border down to the divider rule) */}
            <View style={{ position: 'absolute', left: 8, top: 20, width: PAGE_W - 16, height: 101, backgroundColor: TINT }} />
            {/* Bottom notes box tint (from the notes rule down to the outer border) */}
            <View style={{ position: 'absolute', left: 8, top: 354, width: PAGE_W - 16, height: 96, backgroundColor: TINT }} />

            <View style={S.outerBorder} />

            {/* Top blessings — outside the border */}
            <Text style={[S.blessing, { left: 150, top: 6 }]}>॥ સત્યમેવ જયતે ॥</Text>
            <Text style={[S.blessing, { left: 420, top: 6 }]}>॥ શ્રી શક્તિ કૃપા ॥</Text>
            <Text style={[S.blessing, { left: 690, top: 6 }]}>॥ જય માતાજી ॥</Text>

            {/* 50 METRIC TONS box (left): white 50 over solid blue */}
            <View style={[S.sideBox, { left: 74 }]}>
              <View style={S.sideKeyline} />
              <Text style={S.sideNum}>50</Text>
              <Text style={[S.sideSmall, { marginTop: 3 }]}>METRIC TONS</Text>
              <Text style={S.sideSmall}>COMPUTERIESD</Text>
            </View>

            {/* SERVICE 24 HOURS box (right): white text over solid blue */}
            <View style={[S.sideBox, { left: 712 }]}>
              <View style={S.sideKeyline} />
              <Text style={[S.sideSmall, { fontSize: 10 }]}>SERVICE</Text>
              <Text style={S.sideNum24}>24</Text>
              <Text style={[S.sideSmall, { fontSize: 10 }]}>HOURS</Text>
            </View>

            {/* Header center */}
            <Image src={jaynathTitle} style={{ position: 'absolute', left: 181, top: 28, width: 520, height: 43.8 }} />
            <View style={S.propBand}>
              <Text style={S.propTxt}>Prop. : Kirti Industries</Text>
            </View>
            <Text style={S.address}>Gondal Road, Nr. S.T. Work Shop, Rajkot. Mo. 99245 05555, 99243 10061</Text>

            <View style={[S.rule, { top: 121 }]} />

            {/* Watermark (same lettering as the title) */}
            <Image src={jaynathWatermark} style={{ position: 'absolute', left: 190, top: 181, width: 480, height: 113.4 }} />

            {/* Left column labels */}
            <Text style={[S.lbl, { left: 80, top: 136 }]}>Ticket No.</Text>
            <Text style={[S.lbl, { left: 80, top: 164 }]}>Customer Name :</Text>
            <Text style={[S.lbl, { left: 80, top: 208 }]}>Vehicle No.</Text>
            <Text style={[S.lbl, { left: 80, top: 251 }]}>Gross WT.</Text>
            <Text style={[S.lbl, { left: 80, top: 294 }]}>Tare WT.</Text>
            <Text style={[S.lbl, { left: 80, top: 337 }]}>Net WT.</Text>

            {/* Right column labels */}
            <Text style={[S.lbl, { left: 440, top: 152 }]}>Supplier Name :</Text>
            <Text style={[S.lbl, { left: 440, top: 196 }]}>Item</Text>
            <Text style={[S.lbl, { left: 497, top: 196 }]}>Name :</Text>
            <Text style={[S.lbl, { left: 440, top: 240 }]}>Gross Date</Text>
            <Text style={[S.lbl, { left: 548, top: 240 }]}>:</Text>
            <Text style={[S.lbl, { left: 440, top: 282 }]}>Tare Date</Text>
            <Text style={[S.lbl, { left: 548, top: 282 }]}>:</Text>
            <Text style={[S.lbl, { left: 440, top: 324 }]}>Charges</Text>
            <Text style={[S.lbl, { left: 548, top: 324 }]}>:</Text>

            <View style={[S.rule, { top: 354 }]} />

            {/* Gujarati notes (inside the bottom box) */}
            <Text style={[S.guj, { left: 80, top: 360 }]}>(૧) વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            <Text style={[S.guj, { left: 80, top: 379 }]}>(૨) વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.</Text>
            <Text style={[S.guj, { left: 80, top: 398 }]}>(૩) ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.</Text>

            <Text style={[S.opSig, { left: 728, top: 398 }]}>Operator's Signature</Text>
            <Text style={[S.fully, { left: 350, top: 404 }]}>FULLY COMPUTERRISED WEIGH BRIDGE</Text>
            <Text style={[S.lat, { left: 80, top: 428 }]}>Subject to Rajkot Jurisdiction.</Text>
          </>
        )}

        {showValues && (
          <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            <Text style={[S.val, { left: 215, top: 134, color: vColor }]}>{data.serialNo || ' '}</Text>
            <Text style={[S.val, { left: 230, top: 162, color: vColor }]}>{data.party || ' '}</Text>
            <Text style={[S.val, { left: 215, top: 206, color: vColor }]}>{data.vehicleNo || ' '}</Text>
            <Text style={[S.val, WT, { top: 249, fontSize: 17, color: vColor }]}>{data.gross || ' '}</Text>
            <Text style={[S.val, WT, { top: 292, fontSize: 17, color: vColor }]}>{data.tare || ' '}</Text>
            <Text style={[S.val, WT, { top: 335, fontSize: 17, color: vColor }]}>{data.net || ' '}</Text>
            <Text style={[S.val, { left: 585, top: 150, color: vColor }]}>{data.supplierName || ' '}</Text>
            <Text style={[S.val, { left: 585, top: 194, color: vColor }]}>{data.material || ' '}</Text>
            <Text style={[S.valNarrow, { left: 575, top: 240, color: vColor }]}>{fmtDateSlash(data.grossDate) || ' '}</Text>
            <Text style={[S.valNarrow, { left: 700, top: 240, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Text>
            <Text style={[S.valNarrow, { left: 575, top: 282, color: vColor }]}>{fmtDateSlash(data.tareDate) || ' '}</Text>
            <Text style={[S.valNarrow, { left: 700, top: 282, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Text>
            <Text style={[S.val, { left: 700, top: 315, color: vColor }]}>{fmtCharges(data.charges) || ' '}</Text>
          </View>
        )}

      </PrintPage>
    </Document>
  )
}
