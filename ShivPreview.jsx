import React from 'react'
import SlipScaler from './SlipScaler.jsx'

// Dual-ink palette matching original scan & AmbikaSlip
const RED = '#b82434'          // Rich crimson red press ink
const BLUE = '#1b3b6f'         // Deep navy blue press ink
const PAPER = '#fce3f2'        // Pink tinted continuous paper (inside border only)
const VAL = '#1a1a1a'          // Dark charcoal for values

const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = "'Times New Roman', Times, Georgia, serif"
const DOT = "'DotMatrix', monospace"

const lbl = {
  position: 'absolute',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: SANS,
  color: RED,
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


// GROSS / TARE / NET share one right-aligned column ending at 330, 15pt before
// the next pre-printed label on the row. Mirrors WT in the matching PDF slip.
const WT = { left: 170, width: 160, textAlign: 'right' }

export default function ShivPreview({ data }) {
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
        {/* Outer Red Border with PAPER Background INSIDE the border only */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: PAGE_W - 24,
            height: PAGE_H - 24,
            border: `2px solid ${RED}`,
            borderRadius: 8,
            backgroundColor: PAPER,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />

        {/* ---- Header Section ---- */}
        {/* Left Box: 24 HOURS SERVICE */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            width: 78,
            height: 88,
            border: `1.8px solid ${RED}`,
            borderRadius: 6,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: BLUE,
              lineHeight: 1,
              textAlign: 'center',
              marginTop: 3,
            }}
          >
            24
          </div>
          <div style={{ width: '100%', height: 1.5, backgroundColor: RED, marginTop: 2 }} />
          <div
            style={{
              flex: 1,
              backgroundColor: RED,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px 0',
            }}
          >
            <span style={{ fontSize: 9.2, fontWeight: 700, color: '#ffffff', lineHeight: 1.15, letterSpacing: 0.5 }}>
              HOURS
            </span>
            <span style={{ fontSize: 9.2, fontWeight: 700, color: '#ffffff', lineHeight: 1.15, letterSpacing: 0.5 }}>
              SERVICE
            </span>
          </div>
        </div>

        {/* Center Header Details */}
        <div
          style={{
            position: 'absolute',
            left: 104,
            right: 104,
            top: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 9.5, fontFamily: GUJ, fontWeight: 400, color: RED, textAlign: 'center' }}>
            ॥ જયશ્રી કૃષ્ણ ॥
          </div>

          {/* Straight Red Banner for SHIV WEIGH-BRIDGE (Bigger, No White Border) */}
          <div
            style={{
              width: 520,
              height: 42,
              backgroundColor: RED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontSize: 29,
                fontFamily: SERIF,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '1.5px',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              SHIV WEIGH-BRIDGE
            </span>
          </div>

          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: RED,
              textAlign: 'center',
              letterSpacing: 0.5,
              marginTop: 3,
              whiteSpace: 'nowrap',
            }}
          >
            FULLY ELECTRONIC COMPUTERISED WEIGH BRIDGE
          </div>
          <div
            style={{
              fontSize: 9.2,
              fontWeight: 700,
              color: RED,
              textAlign: 'center',
              letterSpacing: 0.2,
              marginTop: 2,
              whiteSpace: 'nowrap',
            }}
          >
            8-B, NATIONAL HIGHWAY, NEAR P.S. PLYWOOD, SHAPAR(VERAVAL) DIST. RAJKOT.
          </div>
          <div
            style={{
              fontSize: 9.2,
              fontWeight: 700,
              color: RED,
              textAlign: 'center',
              letterSpacing: 0.2,
              marginTop: 2,
              whiteSpace: 'nowrap',
            }}
          >
            Mo. 97272 00002 / 98251 17400
          </div>
        </div>

        {/* Right Box: 100 TONNES PLATFORM SIZE 50x10 */}
        <div
          style={{
            position: 'absolute',
            left: 752,
            top: 20,
            width: 78,
            height: 88,
            border: `1.8px solid ${RED}`,
            borderRadius: 6,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: 27, fontWeight: 700, color: BLUE, textAlign: 'center', lineHeight: 1, marginTop: 3 }}>
            100
          </div>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: RED, textAlign: 'center', letterSpacing: 0.5, marginTop: 1, marginBottom: 2 }}>
            TONNES
          </div>
          <div style={{ width: '100%', height: 1.2, backgroundColor: RED }} />
          <div style={{ fontSize: 7.2, fontWeight: 700, color: BLUE, textAlign: 'center', letterSpacing: 0.3, marginTop: 2 }}>
            PLATFORM SIZE
          </div>
          <div style={{ fontSize: 16.5, fontWeight: 700, color: RED, textAlign: 'center', lineHeight: 1, marginTop: 1, marginBottom: 2 }}>
            50x10
          </div>
        </div>

        {/* ---- Center Main Content Box Container ---- */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 122,
            width: PAGE_W - 40,
            height: 218,
            border: `1.8px solid ${RED}`,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />

        {/* ---- Middle Fields Static Labels & Dynamic Values ---- */}
        {/* Row 1: SERIAL No. & SUPPLIER */}
        <div style={{ ...lbl, left: 36, top: 136 }}>SERIAL No.</div>
        <div style={{ ...val, left: 170, top: 136 }}>{data.serialNo || ''}</div>
        <div style={{ ...lbl, left: 410, top: 136 }}>SUPPLIER</div>
        <div style={{ ...val, left: 510, top: 136 }}>{supplierValue || ''}</div>

        {/* Row 2: CHARGES Rs. & RECEIVER */}
        <div style={{ ...lbl, left: 36, top: 164 }}>CHARGES Rs.</div>
        <div style={{ ...val, left: 170, top: 164 }}>{data.charges || ''}</div>
        <div style={{ ...lbl, left: 410, top: 164 }}>RECEIVER</div>

        {/* Row 3: VEHICLE No. & MATIRIAL */}
        <div style={{ ...lbl, left: 36, top: 192 }}>VEHICLE No.</div>
        <div style={{ ...val, left: 170, top: 192 }}>{data.vehicleNo || ''}</div>
        <div style={{ ...lbl, left: 410, top: 192 }}>MATIRIAL</div>
        <div style={{ ...val, left: 510, top: 192 }}>{data.material || ''}</div>

        {/* Row 4: GROSS, Kg., DATE, TIME */}
        <div style={{ ...lbl, left: 36, top: 232 }}>GROSS</div>
        <div style={{ ...val, ...WT, top: 232 }}>{data.gross || ''}</div>
        <div style={{ ...lbl, left: 345, top: 232 }}>Kg.</div>
        <div style={{ ...lbl, left: 410, top: 232 }}>DATE</div>
        <div style={{ ...val, left: 480, top: 232 }}>{fmtDate(data.grossDate) || ''}</div>
        <div style={{ ...lbl, left: 650, top: 232 }}>TIME</div>
        <div style={{ ...val, left: 710, top: 232 }}>{fmtTime(data.grossTime) || ''}</div>

        {/* Row 5: TARE, Kg., DATE, TIME */}
        <div style={{ ...lbl, left: 36, top: 270 }}>TARE</div>
        <div style={{ ...val, ...WT, top: 270 }}>{data.tare || ''}</div>
        <div style={{ ...lbl, left: 345, top: 270 }}>Kg.</div>
        <div style={{ ...lbl, left: 410, top: 270 }}>DATE</div>
        <div style={{ ...val, left: 480, top: 270 }}>{fmtDate(data.tareDate) || ''}</div>
        <div style={{ ...lbl, left: 650, top: 270 }}>TIME</div>
        <div style={{ ...val, left: 710, top: 270 }}>{fmtTime(data.tareTime) || ''}</div>

        {/* Row 6: NETT, Kg. */}
        <div style={{ ...lbl, left: 36, top: 308 }}>NETT</div>
        <div style={{ ...val, ...WT, top: 308 }}>{data.net || ''}</div>
        <div style={{ ...lbl, left: 345, top: 308 }}>Kg.</div>

        {/* ---- Footer Section ---- */}
        {/* Rules & Conditions Box */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 346,
            width: 618,
            height: 86,
            border: `1.8px solid ${RED}`,
            borderRadius: 8,
            backgroundColor: PAPER,
            boxSizing: 'border-box',
          }}
        >
          {/* Heading: સુચના: */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 7,
              fontSize: 10,
              fontFamily: GUJ,
              fontWeight: 700,
              color: RED,
            }}
          >
            સુચના:
          </div>

          {/* Gujarati Rules */}
          <div style={{ position: 'absolute', left: 54, top: 7, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 4.5, height: 4.5, backgroundColor: RED, marginRight: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontFamily: GUJ, fontWeight: 400, color: RED, whiteSpace: 'nowrap' }}>
                વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 4.5, height: 4.5, backgroundColor: RED, marginRight: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontFamily: GUJ, fontWeight: 400, color: RED, whiteSpace: 'nowrap' }}>
                વજન થઈ ગયા પછી અમારી કોઈપણ જાતની જવાબદારી રહેતી નથી.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 4.5, height: 4.5, backgroundColor: RED, marginRight: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontFamily: GUJ, fontWeight: 400, color: RED, whiteSpace: 'nowrap' }}>
                ગાડીની અંદર શું માલ છે તે તપાસવામાં આવતો નથી.
              </span>
              <span style={{ display: 'inline-block', width: 4.5, height: 4.5, backgroundColor: RED, margin: '0 5px 0 10px', flexShrink: 0 }} />
              <span style={{ fontSize: 8.5, fontFamily: SANS, fontWeight: 700, color: RED, whiteSpace: 'nowrap' }}>
                Subject to Rajkot Jurisdiction.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 4.5, height: 4.5, backgroundColor: RED, marginRight: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontFamily: GUJ, fontWeight: 400, color: RED, whiteSpace: 'nowrap' }}>
                ગાડીનું ખાલી તથા ભરેલું વજન ૨૪ કલાકની અંદર કરાવી લેવું.
              </span>
            </div>
          </div>

          {/* Operator's Signature (without border) */}
          <div
            style={{
              position: 'absolute',
              right: 14,
              bottom: 8,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: SANS,
              color: RED,
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            Operator's Signature
          </div>
        </div>

        {/* Bottom Right Dual Badges */}
        {/* Badge 1: 5 TONNES (SVG layout, completely inside borders) */}
        <div
          style={{
            position: 'absolute',
            left: 646,
            top: 346,
            width: 98,
            height: 86,
            border: `1.8px solid ${RED}`,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <svg viewBox="0 0 94 82" width="94" height="82" style={{ display: 'block' }}>
            <text
              x="4"
              y="62"
              fill={RED}
              fontFamily={SANS}
              fontSize="58"
              fontWeight="bold"
            >
              5
            </text>
            <g transform="translate(42, 6) scale(0.48, 2.9)">
              <text
                x="0"
                y="19"
                fill={BLUE}
                fontFamily={SANS}
                fontSize="19"
                fontWeight="bold"
                letterSpacing="0.4"
              >
                TONNES
              </text>
            </g>
          </svg>
        </div>

        {/* Badge 2: 10 x 6 PLATFORM */}
        <div
          style={{
            position: 'absolute',
            left: 752,
            top: 346,
            width: 78,
            height: 86,
            border: `1.8px solid ${RED}`,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: BLUE, lineHeight: 1, textAlign: 'center' }}>
            10 x 6
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: RED,
              textAlign: 'center',
              letterSpacing: '0.5px',
              marginTop: 4,
            }}
          >
            PLATFORM
          </span>
        </div>
      </div>
    </SlipScaler>
  )
}
