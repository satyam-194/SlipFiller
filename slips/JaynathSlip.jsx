import React from 'react'
import { Document, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import '../fonts.js'
import jaynathTitle from '../jaynathTitle.js'
import jaynathWatermark from '../jaynathWatermark.js'
import jaynathFully from '../jaynathFully.js'
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
  sideNum: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: '#ffffff', lineHeight: 1 },
  // The 24 is the dominant element on the real sign — its caps run 53.8% of
  // the panel height, against 18% for SERVICE and HOURS. Vertical placement is
  // handled by explicit `top` values at the call site, not by this style.
  sideNum24: { fontSize: 46, fontFamily: 'Helvetica-Bold', color: '#ffffff', lineHeight: 1 },
  sideSmall: { fontSize: 8.6, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' },

  // header center — fixed positions so browser and PDF match exactly
  propBand: { position: 'absolute', left: 211, top: 75, width: 460, height: 20.5, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  propTxt: { color: '#ffffff', fontSize: 12.5, fontFamily: 'Helvetica-Bold' },
  address: { position: 'absolute', left: 178, top: 101.5, width: 526, fontSize: 13, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'center' },

  rule: { position: 'absolute', left: 8, width: PAGE_W - 16, height: 1.5, backgroundColor: INK },

  lbl: { position: 'absolute', fontSize: 13.5, fontFamily: 'Helvetica-Bold', color: INK },
  // One size for every typed field, matching JaynathPreview's VAL_SIZE — see
  // the note there for how it was derived from the scan. letterSpacing is 0
  // because DotMatrix is monospaced at one em per character cell, so the
  // advance is already the printer's pitch.
  val: { position: 'absolute', fontSize: 8.5, fontFamily: 'DotMatrix', color: VAL },
  // The dates are NOT condensed on the original — they measured the same cap
  // height as every other value. The 17 CPI mode this used to emulate was only
  // needed because the values were set at 14pt, where a 10-char date from
  // x=575 ran 149pt wide and collided with the time at x=700. At 8.5pt the
  // same date is 85pt and ends at 660, so the collision is gone.
  valNarrow: { position: 'absolute', fontSize: 8.5, fontFamily: 'DotMatrix', color: VAL },

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

// Fake bold — the PDF half of the effect described in JaynathPreview.jsx.
// react-pdf has no text-shadow, so the extra strikes are real <Text> layers
// drawn at the same position plus a sub-point offset. Offsets are identical to
// the preview's so screen and paper land in the same place.
const BOLD_OFFSETS = {
  normal: [],
  strong: [[0.35, 0], [0, 0.35]],
  xstrong: [[0.45, 0], [0, 0.45], [0.45, 0.45], [0.22, 0.22]],
}
const VAL_BOLD = 'strong'

// One typed value, struck VAL_BOLD times. `style` is the usual array of styles;
// left/top come from it, and each extra pass re-reads them so the offset
// applies on top of whatever the caller positioned. Right-aligned fields (the
// WT column) carry width + textAlign in the same style array, so the overstrike
// stays aligned with the base pass without any special handling here.
function Val({ style, children }) {
  const flat = Object.assign({}, ...[].concat(style).filter(Boolean))
  const offs = BOLD_OFFSETS[VAL_BOLD] || []
  return (
    <>
      <Text style={flat}>{children}</Text>
      {offs.map(([dx, dy], i) => (
        <Text
          key={i}
          style={{ ...flat, left: (flat.left || 0) + dx, top: (flat.top || 0) + dy }}
        >
          {children}
        </Text>
      ))}
    </>
  )
}

// GROSS / TARE / NET print as one right-aligned column ending at 425, 15pt
// before the "Gross Date" / "Tare Date" / "Charges" label column at 440. They
// print at the same size as every other value — the original shows no size
// change here. Right-aligning (rather than leaving them left-aligned at 215)
// lines their last digits up whatever the digit count.
const WT = { left: 215 - 62, width: 210, textAlign: 'right' }

// Label column origins. The outer border sits at x=8 with a 1.5pt rule, so 18
// puts the left column hard against it with a small breathing margin. The
// right-hand block moves in to the middle of the slip; MID_COLON keeps the
// colon's original 108pt offset from its label.
const LEFT_LBL = 18
const MID_LBL = 400
const MID_COLON = MID_LBL + 108
// Values travel with their labels, so the same deltas apply to the typed
// fields below (old label origins were 80 and 440).
const LEFT_DX = LEFT_LBL - 80
const MID_DX = MID_LBL - 440

// mode: 'full' | 'blank' (stationery master) | 'values' (dot-matrix overlay)
// offsetX/offsetY (pt): tractor-feed alignment nudge, values layer only
export default function JaynathSlip({ data, mode = 'full', offsetX = 0, offsetY = 0, debug = false, pageMode = 'landscape' }) {
  const isValues = mode === 'values'
  const showStatic = mode !== 'values'
  const showValues = mode !== 'blank'
  const vColor = isValues ? '#000000' : VAL

  return (
    <Document>
      <PrintPage designW={PAGE_W} designH={PAGE_H} bg={isValues ? '#ffffff' : PAPER} debug={debug} pageMode={pageMode}>

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

            {/* 50 METRIC TONS box: hard into the top-left corner of the header
                band, as on the original. The band spans x=8..842, so x=12
                leaves only the 1.5pt border plus a hairline. It used to sit at
                x=74, floating 66pt inside the frame. */}
            <View style={[S.sideBox, { left: 12 }]}>
              <View style={S.sideKeyline} />
              <Text style={S.sideNum}>50</Text>
              <Text style={[S.sideSmall, { fontSize: 10, marginTop: 5 }]}>METRIC TONS</Text>
              <Text style={[S.sideSmall, { fontSize: 10, marginTop: 1 }]}>COMPUTERISED</Text>
            </View>

            {/* SERVICE 24 HOURS box: mirrored into the top-right corner.
                842 - 92 - 4 = 746. */}
            <View style={[S.sideBox, { left: 746 }]}>
              <View style={S.sideKeyline} />
              {/* Each line is placed absolutely rather than stacked in the
                  flex column. Stacking made the layout depend on three line
                  boxes resolving the same way in react-pdf as in the browser,
                  and they do not: the leading differs just enough that HOURS
                  was pushed through the bottom keyline when printed. Fixed
                  tops cannot drift. Positions follow the real sign's bands
                  (SERVICE at 1%, 24 at 23%, HOURS at 82% of panel height),
                  with sizes a little under the measured caps so nothing
                  touches the frame. */}
              <Text style={[S.sideSmall, { position: 'absolute', left: 0, right: 0, top: 9, fontSize: 15, lineHeight: 1 }]}>SERVICE</Text>
              <Text style={[S.sideNum24, { position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center' }]}>24</Text>
              <Text style={[S.sideSmall, { position: 'absolute', left: 0, right: 0, top: 68, fontSize: 14, lineHeight: 1 }]}>HOURS</Text>
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

            {/* Left column labels — hard against the left border (x=8 plus the
                1.5pt rule), as on the original. Was x=80. */}
            <Text style={[S.lbl, { left: LEFT_LBL, top: 136 }]}>Ticket No.</Text>
            <Text style={[S.lbl, { left: LEFT_LBL, top: 164 }]}>Customer Name :</Text>
            <Text style={[S.lbl, { left: LEFT_LBL, top: 208 }]}>Vehicle No.</Text>
            <Text style={[S.lbl, { left: LEFT_LBL, top: 251 }]}>Gross WT.</Text>
            <Text style={[S.lbl, { left: LEFT_LBL, top: 294 }]}>Tare WT.</Text>
            <Text style={[S.lbl, { left: LEFT_LBL, top: 337 }]}>Net WT.</Text>

            {/* Right column labels — pulled in to the middle of the slip. The
                colon column keeps its offset from the label. Was x=440/548. */}
            <Text style={[S.lbl, { left: MID_LBL, top: 152 }]}>Supplier Name :</Text>
            <Text style={[S.lbl, { left: MID_LBL, top: 196 }]}>Item</Text>
            <Text style={[S.lbl, { left: MID_LBL + 57, top: 196 }]}>Name :</Text>
            <Text style={[S.lbl, { left: MID_LBL, top: 240 }]}>Gross Date</Text>
            <Text style={[S.lbl, { left: MID_COLON, top: 240 }]}>:</Text>
            <Text style={[S.lbl, { left: MID_LBL, top: 282 }]}>Tare Date</Text>
            <Text style={[S.lbl, { left: MID_COLON, top: 282 }]}>:</Text>
            <Text style={[S.lbl, { left: MID_LBL, top: 324 }]}>Charges</Text>
            <Text style={[S.lbl, { left: MID_COLON, top: 324 }]}>:</Text>

            <View style={[S.rule, { top: 354 }]} />

            {/* Gujarati notes (inside the bottom box) */}
            <Text style={[S.guj, { left: LEFT_LBL, top: 358 }]}>(૧) વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.</Text>
            <Text style={[S.guj, { left: LEFT_LBL, top: 375 }]}>(૨) વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.</Text>
            <Text style={[S.guj, { left: LEFT_LBL, top: 392 }]}>(૩) ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.</Text>

            <Text style={[S.opSig, { left: 728, top: 392 }]}>Operator's Signature</Text>
            {/* Strapline as artwork, not type: the original is set in the same
                Art Deco display face as the masthead, which Helvetica-Bold
                could not match. Height is derived from the asset's own
                20.755:1 ink aspect — keep them in that proportion. */}
            <Image src={jaynathFully} style={{ position: 'absolute', left: 220, top: 409, width: 290, height: 290 / 20.755 }} />
            <Text style={[S.lat, { left: LEFT_LBL, top: 427 }]}>Subject to Rajkot Jurisdiction.</Text>
          </>
        )}

        {showValues && (
          <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: PAGE_W, height: PAGE_H }}>
            <Val style={[S.val, { left: 215 + LEFT_DX, top: 142, color: vColor }]}>{data.serialNo || ' '}</Val>
            <Val style={[S.val, { left: 230 + LEFT_DX, top: 170, color: vColor }]}>{data.party || ' '}</Val>
            <Val style={[S.val, { left: 215 + LEFT_DX, top: 214, color: vColor }]}>{data.vehicleNo || ' '}</Val>
            <Val style={[S.val, WT, { top: 257, color: vColor }]}>{data.gross || ' '}</Val>
            <Val style={[S.val, WT, { top: 300, color: vColor }]}>{data.tare || ' '}</Val>
            <Val style={[S.val, WT, { top: 343, color: vColor }]}>{data.net || ' '}</Val>
            <Val style={[S.val, { left: 585 + MID_DX, top: 158, color: vColor }]}>{data.supplierName || ' '}</Val>
            <Val style={[S.val, { left: 585 + MID_DX, top: 202, color: vColor }]}>{data.material || ' '}</Val>
            <Val style={[S.valNarrow, { left: 575 + MID_DX, top: 246, color: vColor }]}>{fmtDateSlash(data.grossDate) || ' '}</Val>
            <Val style={[S.valNarrow, { left: 700 + MID_DX, top: 246, color: vColor }]}>{fmtTime(data.grossTime) || ' '}</Val>
            <Val style={[S.valNarrow, { left: 575 + MID_DX, top: 288, color: vColor }]}>{fmtDateSlash(data.tareDate) || ' '}</Val>
            <Val style={[S.valNarrow, { left: 700 + MID_DX, top: 288, color: vColor }]}>{fmtTime(data.tareTime) || ' '}</Val>
            <Val style={[S.val, { left: 700 + MID_DX, top: 330, color: vColor }]}>{fmtCharges(data.charges) || ' '}</Val>
          </View>
        )}

      </PrintPage>
    </Document>
  )
}
