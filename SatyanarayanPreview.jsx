import React from 'react'
import SlipScaler from './SlipScaler.jsx'
import satyanarayanTitle, { satyanarayanTitleAspect } from './satyanarayanTitle.js'

// Color palette matched from satyanarayan.jpeg (same as JaySatyanarayan)
const INK = '#c16460'          // Light red press ink sampled from slip photo
const HEADER_BG = '#fbc8bd'    // Soft dusty pink screened tint for header band & slip body
const FOOTER_BG = '#fbc8bd'    // Soft dusty pink screened tint for footer band
const PAPER = '#ffffff'        // Pure white background for center container
const VAL = '#1a1a1a'          // Dark charcoal for dot-matrix values

const PAGE_W = 850
const PAGE_H = 458

const TITLE_W = 615

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const DOT = "'DotMatrix', monospace"

const lbl = {
  position: 'absolute',
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: SANS,
  color: INK,
  whiteSpace: 'nowrap',
  lineHeight: 1.15,
}

const val = {
  position: 'absolute',
  fontSize: 13.5,
  fontFamily: DOT,
  color: VAL,
  whiteSpace: 'nowrap',
  lineHeight: 1.15,
  letterSpacing: 1,
}
// Condensed pitch (17 CPI) — mirrors the matching valNarrow in the PDF
const valNarrow = { ...val, fontSize: 9.5, letterSpacing: 0.2 }

// Footer note row — mirrors noteRow + gujText in the PDF slip, including its
// lineHeight, so the two render the text block identically.
const noteRow = {
  position: 'absolute',
  left: 24,
  fontSize: 11,
  fontFamily: GUJ,
  fontWeight: 500,
  color: INK,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
}

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


// GROSS / TARE / NET share one right-aligned column ending at 330, 15pt before
// the next pre-printed label on the row. Mirrors WT in the matching PDF slip.
const WT = { left: 150, width: 180, textAlign: 'right' }

export default function SatyanarayanPreview({ data }) {
  const supplierValue = data.supplierName || data.party || ''

  return (
    <SlipScaler width={PAGE_W} height={PAGE_H}>
      <div
        style={{
          width: PAGE_W,
          height: PAGE_H,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          fontFamily: SANS,
          boxSizing: 'border-box',
        }}
      >
        {/* Main Red Border (without radius) with Pink Background inside */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: PAGE_W - 24,
            height: PAGE_H - 24,
            border: `2px solid ${INK}`,
            borderRadius: 0,
            backgroundColor: HEADER_BG,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />

        {/* ---- Header Section (with padding from outer border) ---- */}
        {/* Left Box: 50 MATRIC TON (same background as main background) */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 20,
            width: 80,
            height: 86,
            border: `1.8px solid ${INK}`,
            borderRadius: 8,
            backgroundColor: HEADER_BG,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 900, color: INK, lineHeight: 1 }}>50</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK, marginTop: 3, letterSpacing: 0.6 }}>MATRIC</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK, marginTop: 1, letterSpacing: 0.6 }}>TON</span>
        </div>

        {/* Right Box: 5 MATRIC TON (same background as main background).
            Positioned from the left, matching the PDF slip's sideBox. */}
        <div
          style={{
            position: 'absolute',
            left: 746,
            top: 20,
            width: 80,
            height: 86,
            border: `1.8px solid ${INK}`,
            borderRadius: 8,
            backgroundColor: HEADER_BG,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 42, fontWeight: 900, color: INK, lineHeight: 1 }}>5</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK, marginTop: 2, letterSpacing: 0.6 }}>MATRIC</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK, marginTop: 1, letterSpacing: 0.6 }}>TON</span>
        </div>

        {/* Center Header Details */}
        <div
          style={{
            position: 'absolute',
            left: 110,
            right: 110,
            top: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={satyanarayanTitle}
            alt="SHREE SATYANARAYAN WEIGH-BRIDGE"
            style={{
              width: TITLE_W,
              height: TITLE_W / satyanarayanTitleAspect,
              display: 'block',
              objectFit: 'contain',
            }}
          />
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              fontFamily: SANS,
              color: INK,
              textAlign: 'center',
              lineHeight: 1,
              marginTop: 4,
              letterSpacing: 0.2,
              whiteSpace: 'nowrap',
            }}
          >
            SAMRAT INDUSTRIAL AREA 10/13 CORNER, GONDAL ROAD,
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: SANS,
              color: INK,
              textAlign: 'center',
              lineHeight: 1,
              marginTop: 2,
              letterSpacing: 0.2,
              whiteSpace: 'nowrap',
            }}
          >
            B/H. S.T. WORKSHOP, RAJKOT. Mo. 97731 30841
          </div>
          <div
            style={{
              fontSize: 15.5,
              fontWeight: 800,
              fontFamily: SANS,
              color: INK,
              textAlign: 'center',
              lineHeight: 1,
              marginTop: 15,
              letterSpacing: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            COMPUTERISED WEIGH BRIDGE
          </div>
        </div>

        {/* ---- Main Center Container Part (White Background Color) ---- */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 116,
            width: PAGE_W - 28,
            height: 232,
            backgroundColor: PAPER,
            boxSizing: 'border-box',
          }}
        />

        {/* Static Field Labels & Dynamic Values in Center Part */}
        {/* Row 1: RST NO. & VEHICLE NO. */}
        <div style={{ ...lbl, left: 36, top: 150 }}>RST NO.  :</div>
        <div style={{ ...val, left: 150, top: 150 }}>{data.serialNo || ''}</div>
        <div style={{ ...lbl, left: 540, top: 158 }}>VEHICLE NO. :</div>
        <div style={{ ...valNarrow, left: 680, top: 161 }}>{data.vehicleNo || ''}</div>

        {/* Row 2: SUPPLIER & MATERIAL */}
        <div style={{ ...lbl, left: 36, top: 176 }}>SUPPLIER :</div>
        <div style={{ ...val, left: 150, top: 176 }}>{supplierValue || ''}</div>
        <div style={{ ...lbl, left: 560, top: 184 }}>MATERIAL :</div>
        <div style={{ ...val, left: 680, top: 184 }}>{data.material || ''}</div>

        {/* Row 3: GROSS, DATE, TIME */}
        <div style={{ ...lbl, left: 36, top: 222 }}>GROSS :</div>
        <div style={{ ...val, ...WT, top: 222 }}>{data.gross || ''}</div>
        <div style={{ ...lbl, left: 345, top: 222 }}>DATE :</div>
        <div style={{ ...val, left: 455, top: 222 }}>{fmtDate(data.grossDate) || ''}</div>
        <div style={{ ...lbl, left: 610, top: 222 }}>TIME :</div>
        <div style={{ ...val, left: 680, top: 222 }}>{fmtTime(data.grossTime) || ''}</div>

        {/* Row 4: TARE, DATE, TIME */}
        <div style={{ ...lbl, left: 36, top: 258 }}>TARE  :</div>
        <div style={{ ...val, ...WT, top: 258 }}>{data.tare || ''}</div>
        <div style={{ ...lbl, left: 345, top: 258 }}>DATE :</div>
        <div style={{ ...val, left: 455, top: 258 }}>{fmtDate(data.tareDate) || ''}</div>
        <div style={{ ...lbl, left: 610, top: 258 }}>TIME :</div>
        <div style={{ ...val, left: 680, top: 258 }}>{fmtTime(data.tareTime) || ''}</div>

        {/* Row 5: NET & Charges. On the original "Charges(Rs): 60" is NOT
            pre-printed — the machine types the whole thing, label included. */}
        <div style={{ ...lbl, left: 36, top: 294 }}>NET   :</div>
        <div style={{ ...val, ...WT, top: 294 }}>{data.net || ''}</div>
        {data.charges ? (
          <div style={{ ...val, left: 540, top: 294 }}>
            {`Charges(Rs):  ${data.charges}`}
          </div>
        ) : null}

        {/* ---- Footer Section (Same Pink Background Color as Header) ---- */}
        {/* Gujarati Conditions (4 bullets) + jurisdiction as the LAST line.
            Each row is absolutely placed on the SAME 15pt grid the PDF slip
            uses (y=358..418). A flex column anchored with `bottom` was used
            here before, but its rows resolved ~20pt lower than the PDF's, so
            preview and print disagreed. Absolute tops cannot drift apart. */}
        <div style={{ ...noteRow, top: 364 }}>
          * વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.
        </div>
        <div style={{ ...noteRow, top: 379 }}>
          * વજન થઈ ગયા પછી અમારી કોઈ પણ જાતની જવાબદારી રહેતી નથી.
        </div>
        <div style={{ ...noteRow, top: 394 }}>
          * ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતું નથી.
        </div>
        <div style={{ ...noteRow, top: 409 }}>
          * ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.
        </div>
        <div style={{ ...noteRow, fontFamily: SANS, fontWeight: 700, top: 424 }}>
          * Subject to Rajkot Jurisdiction
        </div>

        {/* Operator Signature */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 424,
            fontSize: 12.5,
            fontWeight: 700,
            fontFamily: SANS,
            color: INK,
            whiteSpace: 'nowrap',
          }}
        >
          Operator Signature
        </div>

        {/* Service 24 Hours Box (same pink background as footer/header).
            Positioned from the left, like the PDF slip's serviceBox, so the
            two cannot disagree by a point or two. */}
        <div
          style={{
            position: 'absolute',
            left: 746,
            top: 355,
            width: 78,
            height: 82,
            border: `1.8px solid ${INK}`,
            borderRadius: 8,
            backgroundColor: FOOTER_BG,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: INK, lineHeight: 1 }}>Service</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: INK, lineHeight: 1, margin: '2px 0' }}>24</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: INK, lineHeight: 1 }}>Hours</span>
        </div>

        {/* Rotated Jagruti Offset credit OUTSIDE the main border part */}
        <div
          style={{
            position: 'absolute',
            left: 838,
            top: 438,          // run ends just inside the bottom border (border spans y 12..446)
            fontSize: 7.5,
            fontWeight: 700,
            fontFamily: SANS,
            color: INK,
            transform: 'rotate(-90deg)',
            transformOrigin: '0 0',
            whiteSpace: 'nowrap',
            letterSpacing: 0.3,
            pointerEvents: 'none',
          }}
        >
          Jagruti Offset : 94272 36877
        </div>
      </div>
    </SlipScaler>
  )
}
