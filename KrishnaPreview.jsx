import React from 'react'
import SlipScaler from './SlipScaler.jsx'
import krishnaArt from './krishnaArt.js'
import krishnaLogo from './krishnaLogo.js'

// Same palette + geometry as KrishnaPDF.jsx (1pt = 1px here)
const INK = '#e14b2a'
const PAPER = '#fde9dc'
const CELL = '#fdf6ef'
const VAL = '#6f6a66'

const PAGE_W = 850
const PAGE_H = 600

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const DOT = "'DotMatrix', 'Courier New', monospace"

// Outer printed border (content is shifted inside it)
const B = { left: 74, top: 19, right: 803, bottom: 592 }
// Horizontal shift applied to all content so it sits inside the border
const SHIFT = 46

// Main table geometry (pre-shift page units)
const T = { left: 44, top: 168, right: 741, bottom: 454 }
const ROW1 = 213
const ROW2 = 241
const ROW3 = 385
const ROW4 = 421
const MID_L = 346
const MID_R = 454
const MID1 = 295
const MID2 = 338
const LEFT_DIV = 313
const BW = 2.2

const gujB = { position: 'absolute', fontFamily: GUJ, fontWeight: 700, color: INK, whiteSpace: 'nowrap', lineHeight: 1.3 }
const guj = { position: 'absolute', fontFamily: GUJ, fontWeight: 400, color: INK, whiteSpace: 'nowrap', lineHeight: 1.3 }
const latB = { position: 'absolute', fontFamily: SANS, fontWeight: 700, color: INK, whiteSpace: 'nowrap', lineHeight: 1.15 }
const val = { position: 'absolute', fontFamily: DOT, color: VAL, whiteSpace: 'nowrap', lineHeight: 1.15 }
const hline = { position: 'absolute', height: BW, backgroundColor: INK }
const vline = { position: 'absolute', width: BW, backgroundColor: INK }

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDateSlash = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// Krishna header artwork supplied as an image (cropped, background keyed transparent)
function KrishnaArtIcon() {
  return <img src={krishnaArt} alt="" style={{ width: 100, height: 105, display: 'block' }} />
}

export default function KrishnaPreview({ data }) {
  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div style={{ position: 'relative', width: PAGE_W, height: PAGE_H, backgroundColor: PAPER, boxShadow: '0 1px 6px rgba(0,0,0,.25)' }}>

        {/* Outer printed border */}
        <div style={{
          position: 'absolute', left: B.left, top: B.top,
          width: B.right - B.left, height: B.bottom - B.top,
          boxSizing: 'border-box', border: `2.5px solid ${INK}`,
        }} />

        {/* All slip content, shifted inside the border */}
        <div style={{ position: 'absolute', left: SHIFT, top: 0, width: PAGE_W, height: PAGE_H }}>

        {/* Top line */}
        <div style={{ position: 'absolute', left: 86, top: 38, display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: GUJ, fontWeight: 700, fontSize: 12.5, color: INK, whiteSpace: 'pre' }}>૧૦ ટન કેપેસીટી </span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, color: INK, whiteSpace: 'pre' }}>2 Kg. </span>
          <span style={{ fontFamily: GUJ, fontWeight: 700, fontSize: 12.5, color: INK }}>સ્કેલ</span>
        </div>
        <span style={{ ...gujB, left: 472, top: 42, width: 270, fontSize: 14.5, textAlign: 'center' }}>ઇલેક્ટ્રોનિકસ (એવરી ઇન્ડીયા)</span>

        {/* No. / Date block */}
        <span style={{ ...latB, left: 53, top: 62, fontSize: 21 }}>No.</span>
        <span style={{ ...val, left: 130, top: 96, fontSize: 19, letterSpacing: 2 }}>{data.serialNo}</span>
        <span style={{ ...latB, left: 53, top: 107, fontSize: 21 }}>Date :</span>
        <span style={{ ...val, left: 130, top: 140, fontSize: 19, letterSpacing: 2 }}>{fmtDateSlash(data.grossDate)}</span>

        {/* Header: Krishna art + title + address */}
        <div style={{ position: 'absolute', left: 326, top: 60 }}>
          <KrishnaArtIcon />
        </div>
        <span style={{ ...gujB, left: 420, top: 64, width: 332, fontSize: 37, letterSpacing: 1, textAlign: 'center', lineHeight: 1.15 }}>ક્રિષ્ના વે-બ્રીજ</span>
        <span style={{ ...gujB, left: 420, top: 112, width: 332, fontSize: 13, textAlign: 'center' }}>૪, મવડી પ્લોટ કોર્નર, રાજકોટ-૩૬૦૦૦૪.</span>
        <span style={{ ...gujB, left: 500, top: 132, width: 252, fontSize: 13.5, textAlign: 'center' }}>મો. ૯૭૨૪૯ ૬૪૫૯૪</span>

        {/* ---- Main table ---- */}
        <div style={{ position: 'absolute', left: T.left, top: T.top, width: T.right - T.left, height: ROW2 - T.top, backgroundColor: CELL }} />
        <div style={{ position: 'absolute', left: T.left, top: ROW2, width: T.right - T.left, height: ROW3 - ROW2, backgroundColor: CELL }} />
        <div style={{ position: 'absolute', left: T.left, top: ROW3, width: T.right - T.left, height: T.bottom - ROW3, backgroundColor: CELL }} />
        {/* whole table is white, like the printed slip */}
        <div style={{ position: 'absolute', left: T.left, top: T.top, width: T.right - T.left, height: T.bottom - T.top, boxSizing: 'border-box', border: `${BW}px solid ${INK}` }} />
        <div style={{ ...hline, left: T.left, top: ROW1, width: T.right - T.left }} />
        <div style={{ ...hline, left: T.left, top: ROW2, width: T.right - T.left }} />
        {/* ROW3 stops at the middle column's right edge — the weight zone stays open down to ROW4 */}
        <div style={{ ...hline, left: T.left, top: ROW3, width: MID_R - T.left }} />
        <div style={{ ...hline, left: T.left, top: ROW4, width: T.right - T.left }} />
        <div style={{ ...hline, left: T.left, top: LEFT_DIV, width: MID_L - T.left }} />
        <div style={{ ...hline, left: MID_L, top: MID1, width: MID_R - MID_L }} />
        <div style={{ ...hline, left: MID_L, top: MID2, width: MID_R - MID_L }} />
        <div style={{ ...vline, left: MID_L, top: ROW2, height: ROW3 - ROW2 }} />
        <div style={{ ...vline, left: MID_R, top: ROW2, height: ROW3 - ROW2 }} />

        {/* row labels + values */}
        <span style={{ ...gujB, left: 52, top: 178, fontSize: 14.5 }}>વેચનાર :</span>
        <span style={{ ...val, left: 160, top: 184, fontSize: 15, letterSpacing: 2 }}>{data.party}</span>
        <span style={{ ...gujB, left: 52, top: 214, fontSize: 14.5 }}>ખરીદનાર :</span>
        <span style={{ ...val, left: 170, top: 218, fontSize: 15, letterSpacing: 2 }}>{data.supplierName}</span>

        <span style={{ ...gujB, left: 52, top: 246, fontSize: 14.5 }}>મીલની જાત :</span>
        <span style={{ ...val, left: 54, top: 288, fontSize: 16, letterSpacing: 2 }}>{data.material}</span>
        <span style={{ ...gujB, left: 52, top: 318, fontSize: 14.5 }}>માલ વાહક :</span>
        <span style={{ ...val, left: 54, top: 352, fontSize: 17, letterSpacing: 2 }}>{data.vehicleNo}</span>

        {/* middle column cells */}
        <span style={{ ...gujB, left: MID_L, top: 246, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }}>સબારદાન</span>
        <span style={{ ...latB, left: MID_L, top: 272, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }}>Kg.</span>
        <span style={{ ...gujB, left: MID_L, top: 299, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }}>બારદાન</span>
        <span style={{ ...latB, left: MID_L, top: 318, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }}>Kg.</span>
        <span style={{ ...gujB, left: MID_L, top: 341, width: MID_R - MID_L, fontSize: 14, textAlign: 'center' }}>નેટ વજન</span>
        <span style={{ ...latB, left: MID_L, top: 362, width: MID_R - MID_L - 14, fontSize: 12, textAlign: 'right' }}>Kg.</span>

        {/* weight values (open pink zone) */}
        <span style={{ ...val, left: MID_R, top: 256, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center' }}>{data.gross}</span>
        <span style={{ ...val, left: MID_R + 40, top: 310, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center' }}>{data.tare}</span>
        <span style={{ ...val, left: MID_R + 30, top: 346, width: T.right - MID_R, fontSize: 24, letterSpacing: 7, textAlign: 'center' }}>{data.net}</span>

        <span style={{ ...gujB, left: 52, top: 390, fontSize: 14.5 }}>રીમાર્ક :</span>
        <span style={{ ...val, left: 150, top: 394, fontSize: 15, letterSpacing: 2 }}>{data.remark}</span>

        <span style={{ ...gujB, left: 52, top: 426, fontSize: 14.5 }}>તોલાઈ ચાર્જ :</span>
        <span style={{ ...val, left: 172, top: 428, fontSize: 16, letterSpacing: 2 }}>{data.charges}</span>
        <span style={{ ...gujB, left: 390, top: 426, fontSize: 14.5 }}>તોલનાર :</span>
        <span style={{ ...val, left: 478, top: 428, fontSize: 16, letterSpacing: 4 }}>{(data.weigherName || '').toUpperCase()}</span>

        {/* request / note line */}
        <span style={{ ...guj, left: 38, top: 464, fontSize: 11, fontWeight: 700 }}>વિનંતી : વે-બ્રીજથી નિકળ્યા બાદ વજનમાં થતા ફેરફાર માટે વે-બ્રીજ જવાબદાર નથી. બાદબાકી તથા વજન ચકાસી લેવા.</span>

        {/* ---- Footer: Krishna Metals logo lockup (supplied artwork) ---- */}
        <img src={krishnaLogo} alt="" style={{ position: 'absolute', left: 50, top: 486, width: 340, height: 99 }} />

        {/* right footer block */}
        <span style={{ ...latB, left: 420, top: 498, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }}>SPECIALIST IN : ALL TYPES OF HEAVY</span>
        <span style={{ ...latB, left: 420, top: 515, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }}>ALLUMINIUM CASTING & PLATES CASTING FOR DIE</span>
        <div style={{ ...hline, left: 420, top: 537, width: T.right - 420, height: 1.5 }} />
        <span style={{ ...latB, left: 420, top: 543, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }}>4, Mavdi Plot, Tanti Road, Opp. Saurastra</span>
        <span style={{ ...latB, left: 420, top: 560, width: T.right - 420, fontSize: 12.5, textAlign: 'center' }}>Besan Mill, RAJKOT - 360 004. PH. 2365348</span>

        </div>

      </div>
    </SlipScaler>
  )
}
