import React from 'react'
import { Page, View } from '@react-pdf/renderer'

// Physical page: 8in x 4in landscape continuous paper, 72pt/in.
// 8in = 203.2mm, 4in = 101.6mm. PRINT_W > PRINT_H, so the MediaBox is
// landscape by construction — no printer-side rotation is ever required.
export const PRINT_W = 8 * 72 // 576pt = 203.2mm
export const PRINT_H = 4 * 72 // 288pt = 101.6mm

export const mmToPt = (mm) => (mm * 72) / 25.4

// Shared 8x4in landscape page.
//
// Each template's design canvas (e.g. 850x458) is a scan-derived coordinate
// space that represents the WHOLE slip, so it must map onto the whole page.
// Earlier this used a single uniform Math.min() scale inside an inset "safe
// area", which fit the canvas to whichever axis ran out first and left the
// rest of the sheet blank: Ambika/Jaynath printed 490x264pt (30mm of unused
// width) and Krishna only 374x264pt (71mm unused, 59% of the page). The slip
// came out small and floating rather than matching the preview.
//
// Both axes are now mapped independently so the canvas lands on the page
// exactly, edge to edge — matching the on-screen preview, which likewise
// renders the canvas filling its frame. Because each design's aspect ratio is
// baked into its own coordinate space (and is not 2:1), per-axis factors are
// what make the printed result geometrically correct; a uniform scale is what
// introduced the mismatch. No centering offsets remain, so nothing can drift.
export default function PrintPage({ designW, designH, bg, debug = false, children }) {
  const scaleX = PRINT_W / designW
  const scaleY = PRINT_H / designH
  return (
    // size=[576,288] already has W>H, so the MediaBox is landscape as given.
    // Do NOT add orientation="landscape" here: react-pdf treats the tuple as
    // portrait-normalised and would swap it to [288,576], which (with
    // wrap=false) collapsed the box to [0 0 288 0]. The explicit tuple is the
    // single source of truth for page geometry.
    // margin/padding 0 — the design canvas carries its own internal padding,
    // and any page margin would shift content off the pre-printed stationery.
    // Width/height are intentionally not set in style; they would fight the
    // size prop. wrap=false keeps the scaled canvas on exactly one page.
    <Page
      size={[PRINT_W, PRINT_H]}
      wrap={false}
      style={{ margin: 0, padding: 0, backgroundColor: bg, fontFamily: 'Helvetica' }}
    >
      {/* Must stay IN FLOW (no position:'absolute'): with wrap=false react-pdf
          derives the page height from in-flow content, so an absolute root
          yields a zero-height MediaBox ([0 0 576 0]). This full-size in-flow
          View is what fixes the 288pt height. */}
      <View style={{ width: PRINT_W, height: PRINT_H, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: designW,
            height: designH,
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: '0% 0%',
          }}
        >
          {children}
        </View>

        {/* Alignment-test guides: paper edge (red) + horizontal/vertical
            centre lines (green), for checking the sheet feeds square and
            prints landscape at 100% scale */}
        {debug && (
          <>
            <View style={{
              position: 'absolute', left: 0, top: 0,
              width: PRINT_W - 1, height: PRINT_H - 1,
              border: '1 dashed #ff0000',
            }} />
            <View style={{
              position: 'absolute', left: 0, top: PRINT_H / 2,
              width: PRINT_W, height: 0.5, backgroundColor: '#00a000',
            }} />
            <View style={{
              position: 'absolute', left: PRINT_W / 2, top: 0,
              width: 0.5, height: PRINT_H, backgroundColor: '#00a000',
            }} />
          </>
        )}
      </View>
    </Page>
  )
}
