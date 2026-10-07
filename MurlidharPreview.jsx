import React from 'react'
import SlipScaler from './SlipScaler.jsx'
import murlidharLogo from './murlidharLogo.js'

// Color palette matched accurately from murlidhar cropped.jpeg
const BLUE = '#244594'         // Royal/Cobalt Blue press ink
const GOLD = '#cca028'         // Mustard/Amber Gold banner fill
const CREAM = '#f9eb82'        // Soft light yellow tint for header & rules
const VAL = '#1a1a1a'          // Charcoal for dot-matrix values

const PAGE_W = 850
const PAGE_H = 458

const GUJ = "'Noto Sans Gujarati', sans-serif"
const SANS = 'Helvetica, Arial, sans-serif'
const SERIF = "'Times New Roman', Times, Georgia, serif"
const DOT = "'DotMatrix', monospace"

const lbl = {
  position: 'absolute',
  fontSize: 12.5,
  fontWeight: 700,
  fontFamily: SANS,
  color: BLUE,
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

// Truck Loaded Icon (GROSS)
function MurlidharTruckLoaded() {
  return (
    <svg viewBox="0 0 50 28" width="50" height="28" style={{ display: 'block' }}>
      <rect x="1" y="4" width="34" height="15" fill={BLUE} rx="1" />
      <rect x="3" y="7" width="30" height="2" fill="#ffffff" />
      <rect x="3" y="11" width="30" height="2" fill="#ffffff" />
      <rect x="3" y="15" width="30" height="2" fill="#ffffff" />
      <rect x="35" y="8" width="13" height="11" fill={BLUE} rx="2" />
      <rect x="38" y="10" width="6" height="4" fill="#ffffff" rx="1" />
      <rect x="1" y="19" width="47" height="2.5" fill={BLUE} />
      <circle cx="8" cy="22" r="3.5" fill={BLUE} />
      <circle cx="16" cy="22" r="3.5" fill={BLUE} />
      <circle cx="42" cy="22" r="3.5" fill={BLUE} />
      <circle cx="8" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="16" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="42" cy="22" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// Truck Empty Icon (TARE)
function MurlidharTruckEmpty() {
  return (
    <svg viewBox="0 0 50 28" width="50" height="28" style={{ display: 'block' }}>
      <rect x="1" y="15" width="34" height="4" fill={BLUE} />
      <rect x="35" y="8" width="13" height="11" fill={BLUE} rx="2" />
      <rect x="38" y="10" width="6" height="4" fill="#ffffff" rx="1" />
      <rect x="1" y="19" width="47" height="2.5" fill={BLUE} />
      <circle cx="8" cy="22" r="3.5" fill={BLUE} />
      <circle cx="16" cy="22" r="3.5" fill={BLUE} />
      <circle cx="42" cy="22" r="3.5" fill={BLUE} />
      <circle cx="8" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="16" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="42" cy="22" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// Net 3-Bar Icon (NET)
function MurlidharNetIcon() {
  return (
    <svg viewBox="0 0 46 18" width="46" height="18" style={{ display: 'block' }}>
      <rect x="1" y="1" width="12" height="4" fill={BLUE} />
      <rect x="16" y="1" width="12" height="4" fill={BLUE} />
      <rect x="31" y="1" width="12" height="4" fill={BLUE} />

      <rect x="1" y="7" width="12" height="4" fill={BLUE} />
      <rect x="16" y="7" width="12" height="4" fill={BLUE} />
      <rect x="31" y="7" width="12" height="4" fill={BLUE} />

      <rect x="1" y="13" width="12" height="4" fill={BLUE} />
      <rect x="16" y="13" width="12" height="4" fill={BLUE} />
      <rect x="31" y="13" width="12" height="4" fill={BLUE} />
    </svg>
  )
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
const fmtDate = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d)

// 'HH:MM' (24h) -> 'HH:MM'
const fmtTime = (t) => {
  if (!t) return ''
  return t
}

export default function MurlidharPreview({ data }) {
  const receiverValue = data.party || data.receiver || ''
  const supplierValue = data.supplierName || ''

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
        {/* Single Main Blue Border with Light Yellow Paper Background INSIDE the border only */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: PAGE_W - 24,
            height: PAGE_H - 24,
            border: `2px solid ${BLUE}`,
            borderRadius: 0,
            backgroundColor: CREAM,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />

        {/* ---- Header Section (with padding from outer border) ---- */}
        {/* Left Box: CAPACITY 50/5 TONES & 24 HOUR SERVICE (Enclosed box with padding) */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 20,
            width: 120,
            height: 104,
            border: `1.5px solid ${BLUE}`,
            backgroundColor: BLUE,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 50,
              backgroundColor: BLUE,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff', letterSpacing: '0.8px', lineHeight: 1 }}>
              CAPACITY
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', marginTop: 4, lineHeight: 1 }}>
              50 / 5 TONES
            </span>
          </div>
          <div style={{ width: '100%', height: 1.5, backgroundColor: '#ffffff' }} />
          <div
            style={{
              width: '100%',
              height: 51,
              backgroundColor: BLUE,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', letterSpacing: '0.8px', lineHeight: 1, }}>
              24 HOUR
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', letterSpacing: '1px', marginTop: 3, lineHeight: 1 }}>
              SERVICE
            </span>
          </div>
        </div>

        {/* Center Header Details */}
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 18,
            width: 504,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Blessing Row */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 28px',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 9.5, fontFamily: GUJ, fontWeight: 700, color: BLUE }}>॥ રામ ॥</span>
            <span style={{ fontSize: 9.5, fontFamily: GUJ, fontWeight: 700, color: BLUE }}>॥ જયશ્રી કૃષ્ણ ॥</span>
            <span style={{ fontSize: 9.5, fontFamily: GUJ, fontWeight: 700, color: BLUE }}>॥ રામ ॥</span>
          </div>

          {/* MURLIDHAR Title (Royal Blue Serif with white highlight/bevel effect) */}
          <div
            style={{
              fontSize: 41,
              fontFamily: SERIF,
              fontWeight: 900,
              color: BLUE,
              letterSpacing: '2px',
              textAlign: 'center',
              lineHeight: 1,
              marginTop: 1,
              textShadow: '1.5px 1.5px 0 #ffffff, -1.5px -1.5px 0 #ffffff, 1.5px -1.5px 0 #ffffff, -1.5px 1.5px 0 #ffffff',
            }}
          >
            MURLIDHAR
          </div>

          {/* WEIGH-BRIDGE in White inside Gold Banner */}
          <div
            style={{
              backgroundColor: GOLD,
              padding: '2.5px 26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1.5,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '2.5px',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              WEIGH-BRIDGE
            </span>
          </div>

          {/* Address Line (Big) */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: BLUE,
              textAlign: 'center',
              letterSpacing: '0.2px',
              marginTop: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            Plot No. G-920, Kishan Gate Road, Murlidhar Complex, GIDC, METODA.
          </div>

          {/* Phone Line (Big) */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: BLUE,
              textAlign: 'center',
              letterSpacing: '0.3px',
              marginTop: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            Phone : (02827) 287734 • 90971 77777
          </div>
        </div>

        {/* Right Header: Logo & Badge with padding from outer border */}
        <img
          src={murlidharLogo}
          alt="Murlidhar Logo"
          style={{
            position: 'absolute',
            left: 727,
            top: 16,
            width: 78,
            height: 78,
            objectFit: 'contain',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 708,
            top: 96,
            width: 120,
            height: 28,
            backgroundColor: BLUE,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', lineHeight: 1.15 }}>
            GROUP OF MURLIDHAR
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', lineHeight: 1.15 }}>
            WEIGHBRIDGE
          </span>
        </div>

        {/* ---- Main Center Content Box (Blue Border & White Background) ---- */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 124,
            width: 806,
            height: 212,
            border: `1.5px solid ${BLUE}`,
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        />

        {/* Center Watermark Logo */}
        <div
          style={{
            position: 'absolute',
            left: 338,
            top: 145,
            pointerEvents: 'none',
            opacity: 0.10,
          }}
        >
          <img src={murlidharLogo} alt="" style={{ width: 170, height: 170, objectFit: 'contain' }} />
        </div>

        {/* Static Field Labels & Dynamic Values */}
        {/* Row 1: SR. NO, CHARGES RS., VEHICLE No. */}
        <div style={{ ...lbl, left: 32, top: 134 }}>SR. NO</div>
        <div style={{ ...lbl, left: 86, top: 134 }}>:</div>
        <div style={{ ...val, left: 98, top: 134 }}>{data.serialNo || ''}</div>

        <div style={{ ...lbl, left: 308, top: 134 }}>CHARGES RS. :</div>
        <div style={{ ...val, left: 418, top: 134 }}>{data.charges || ''}</div>

        <div style={{ ...lbl, left: 540, top: 134 }}>VEHICLE No. :</div>
        <div style={{ ...val, left: 650, top: 134 }}>{data.vehicleNo || ''}</div>

        {/* Row 2: RECEIVER, SUPPLIER */}
        <div style={{ ...lbl, left: 32, top: 162 }}>RECEIVER :</div>
        <div style={{ ...val, left: 118, top: 162 }}>{receiverValue || ''}</div>

        <div style={{ ...lbl, left: 540, top: 162 }}>SUPPLIER :</div>
        <div style={{ ...val, left: 635, top: 162 }}>{supplierValue || ''}</div>

        {/* Weigh Rows */}
        {/* Row 3: GROSS */}
        <div style={{ position: 'absolute', left: 32, top: 194 }}>
          <MurlidharTruckLoaded />
        </div>
        <div style={{ ...lbl, left: 92, top: 202, fontSize: 14 }}>GROSS</div>
        <div style={{ ...val, left: 165, top: 202, fontSize: 14 }}>{data.gross || ''}</div>
        <div style={{ ...lbl, left: 308, top: 202, fontSize: 13 }}>Kg.</div>
        <div style={{ ...lbl, left: 345, top: 202, fontSize: 13 }}>DATE :</div>
        <div style={{ ...val, left: 410, top: 202 }}>{fmtDate(data.grossDate) || ''}</div>
        <div style={{ ...lbl, left: 605, top: 202, fontSize: 13 }}>TIME</div>
        <div style={{ ...val, left: 655, top: 202 }}>{fmtTime(data.grossTime) || ''}</div>

        {/* Row 4: TARE */}
        <div style={{ position: 'absolute', left: 32, top: 238 }}>
          <MurlidharTruckEmpty />
        </div>
        <div style={{ ...lbl, left: 92, top: 246, fontSize: 14 }}>TARE</div>
        <div style={{ ...val, left: 165, top: 246, fontSize: 14 }}>{data.tare || ''}</div>
        <div style={{ ...lbl, left: 308, top: 246, fontSize: 13 }}>Kg.</div>
        <div style={{ ...lbl, left: 345, top: 246, fontSize: 13 }}>DATE :</div>
        <div style={{ ...val, left: 410, top: 246 }}>{fmtDate(data.tareDate) || ''}</div>
        <div style={{ ...lbl, left: 605, top: 246, fontSize: 13 }}>TIME</div>
        <div style={{ ...val, left: 655, top: 246 }}>{fmtTime(data.tareTime) || ''}</div>

        {/* Row 5: NET */}
        <div style={{ position: 'absolute', left: 32, top: 286 }}>
          <MurlidharNetIcon />
        </div>
        <div style={{ ...lbl, left: 92, top: 290, fontSize: 14 }}>NET</div>
        <div style={{ ...val, left: 165, top: 290, fontSize: 14 }}>{data.net || ''}</div>
        <div style={{ ...lbl, left: 308, top: 290, fontSize: 13 }}>Kg.</div>
        <div style={{ ...lbl, left: 540, top: 290, fontSize: 13 }}>MATERIAL :</div>
        <div style={{ ...val, left: 645, top: 290 }}>{data.material || ''}</div>

        {/* ---- Rules Section (y: 338 to 396, with padding from outer border) ---- */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 338,
            width: 806,
            height: 58,
            backgroundColor: CREAM,
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 342,
            fontSize: 10.5,
            fontFamily: GUJ,
            fontWeight: 700,
            color: BLUE,
          }}
        >
          નિયમો :
        </div>

        {/* Rules Lines (Full Width & Clear Text) */}
        <div style={{ position: 'absolute', left: 72, right: 36, top: 342, display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, marginRight: 5, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontFamily: GUJ, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
            K -લખેલ હોય તો કહેવાથી ખાલી વજન બાદ કરેલ છે.
          </span>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, margin: '0 6px 0 16px', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontFamily: GUJ, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
            વજન કરતી વખતે પાર્ટીએ પોતાના જવાબદાર માણસને ગાડી સાથે મોકલી વજન તપાસી લેવું.
          </span>
        </div>

        <div style={{ position: 'absolute', left: 72, right: 36, top: 358, display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, marginRight: 5, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontFamily: GUJ, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
            ૨૪ કલાક પહેલાં તોલ થયેલ ખાલી ટ્રક / લારીનો વજન બાદ કરી આપવામાં આવશે નહીં.
          </span>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, margin: '0 6px 0 16px', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontFamily: GUJ, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
            વે બ્રીજ ઉપરથી ચાલ્યા ગયા બાદ વજનમાં થતા ફેરફાર માટે
          </span>
        </div>

        <div style={{ position: 'absolute', left: 72, right: 36, top: 374, display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, marginRight: 5, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontFamily: GUJ, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
            વે બ્રિજ જવાબદાર નથી.
          </span>
          <span style={{ display: 'inline-block', width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: BLUE, margin: '0 6px 0 16px', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontFamily: SANS, fontWeight: 500, color: BLUE, whiteSpace: 'nowrap' }}>
            Subject to rajkot Jurisdiction.
          </span>
        </div>

        {/* ---- Footer Contiguous Bar (y: 402 to 440, with padding from outer border) ---- */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 402,
            width: 806,
            height: 38,
            display: 'flex',
            border: `1.5px solid ${BLUE}`,
            boxSizing: 'border-box',
          }}
        >
          {/* Left Box: MADHAV WEIGH BRIDGE */}
          <div
            style={{
              width: 170,
              height: 37,
              backgroundColor: BLUE,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', lineHeight: 1 }}>
              MADHAV
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', marginTop: 2, lineHeight: 1 }}>
              WEIGH BRIDGE
            </span>
          </div>

          {/* Center Box: Krishna Complex */}
          <div
            style={{
              width: 426,
              height: 37,
              backgroundColor: '#ffffff',
              borderLeft: `1.5px solid ${BLUE}`,
              borderRight: `1.5px solid ${BLUE}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: BLUE, lineHeight: 1.15 }}>
              Krishna Complex, Gujarat Gas Road, GIDC Metoda.
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: BLUE, marginTop: 2, lineHeight: 1.15 }}>
              <b>Ph. :</b> 02827 - 286079
            </span>
          </div>

          {/* Right Box: Plate Size & Capacity */}
          <div
            style={{
              width: 210,
              height: 37,
              backgroundColor: BLUE,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px', lineHeight: 1 }}>
              Plate Size : 10x60
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px', marginTop: 2, lineHeight: 1 }}>
              Capacity : 100 Tonnes
            </span>
          </div>
        </div>
      </div>
    </SlipScaler>
  )
}
