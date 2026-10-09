import React from 'react'
import { Page, View } from '@react-pdf/renderer'

// Physical slip: 8in x 4in continuous pre-printed stationery, 72pt/in.
// 8in = 203.2mm, 4in = 101.6mm.
export const PRINT_W = 8 * 72 // 576pt = 203.2mm
export const PRINT_H = 4 * 72 // 288pt = 101.6mm

// A4 portrait, byte-matching the reference PDF the operator confirmed
// prints perfectly on the LX-310 ("Microsoft: Print To PDF" output:
// MediaBox [0 0 595.32 841.92], /Rotate 0). Using the identical page box
// means the driver treats our output exactly like that known-good file.
export const A4_W = 595.32
export const A4_H = 841.92

export const mmToPt = (mm) => (mm * 72) / 25.4

// Shared slip page.
//
// Each template's design canvas (e.g. 850x458) is a scan-derived coordinate
// space that represents the WHOLE slip, so it must map onto the whole slip
// area. Earlier this used a single uniform Math.min() scale inside an inset
// "safe area", which fit the canvas to whichever axis ran out first and left
// the rest of the sheet blank: Ambika/Jaynath printed 490x264pt (30mm of
// unused width) and Krishna only 374x264pt (71mm unused, 59% of the page).
// The slip came out small and floating rather than matching the preview.
//
// Both axes are now mapped independently so the canvas lands on the slip
// area exactly, edge to edge — matching the on-screen preview, which likewise
// renders the canvas filling its frame. Because each design's aspect ratio is
// baked into its own coordinate space (and is not 2:1), per-axis factors are
// what make the printed result geometrically correct; a uniform scale is what
// introduced the mismatch. No centering offsets remain, so nothing can drift.
//
// pageMode selects the page geometry sent to the printer:
//
// 'a4' (default in the app) — portrait A4 MediaBox (595.32x841.92, same as
//   the known-good reference PDF) with the 8x4in slip content drawn at
//   ACTUAL SIZE in the top-left corner. Portrait pages are never
//   auto-rotated by the driver, so the output orientation is deterministic —
//   top of page prints first, across the 8in width of the form. The rest of
//   the A4 page is blank feed.
//
// 'landscape' — true 8x4in landscape MediaBox (576x288). Correct geometry,
//   but the driver auto-rotates it onto its portrait-defined paper and may
//   pick the direction that lands 180° off the pre-printed stationery.
//
// 'landscape-flip' — same 8x4in MediaBox with the content counter-rotated
//   180° about the page centre, for drivers whose auto-rotation lands
//   upside down. Transform is render-only, so page geometry is unaffected.
export default function PrintPage({ designW, designH, bg, debug = false, pageMode = 'landscape', children }) {
  const scaleX = PRINT_W / designW
  const scaleY = PRINT_H / designH
  const portrait = pageMode === 'a4'
  const pageW = portrait ? A4_W : PRINT_W
  const pageH = portrait ? A4_H : PRINT_H
  const flip = pageMode === 'landscape-flip'
  return (
    // The explicit [w, h] tuple is the single source of truth for page
    // geometry. For the landscape modes, size=[576,288] already has W>H, so
    // the MediaBox is landscape as given. Do NOT add orientation="landscape":
    // react-pdf treats the tuple as portrait-normalised and would swap it to
    // [288,576], which (with wrap=false) collapsed the box to [0 0 288 0].
    // margin/padding 0 — the design canvas carries its own internal padding,
    // and any page margin would shift content off the pre-printed stationery.
    // Width/height are intentionally not set in style; they would fight the
    // size prop. wrap=false keeps the scaled canvas on exactly one page.
    <Page
      size={[pageW, pageH]}
      wrap={false}
      style={{ margin: 0, padding: 0, backgroundColor: '#ffffff', fontFamily: 'Helvetica' }}
    >
      {/* Must stay IN FLOW (no position:'absolute'): with wrap=false react-pdf
          derives the page height from in-flow content, so an absolute root
          yields a zero-height MediaBox ([0 0 576 0]). This full-page in-flow
          View is what fixes the page height. */}
      <View style={{ width: pageW, height: pageH, overflow: 'hidden' }}>
        {/* The 8x4in slip area. In 'a4' mode it sits at the top-left of
            the A4 page — x=0 is the left paper edge, y=0 is top-of-form,
            exactly where the known-good reference PDF starts its content.
            In the landscape modes it IS the page. Rotating this page-sized
            box about its own centre ('landscape-flip') maps it exactly onto
            itself. */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PRINT_W,
            height: PRINT_H,
            overflow: 'hidden',
            backgroundColor: bg,
            ...(flip ? { transform: 'rotate(180deg)', transformOrigin: '50% 50%' } : {}),
          }}
        >
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

          {/* Alignment-test guides: slip edge (red) + horizontal/vertical
              centre lines (green), for checking the sheet feeds square and
              prints at 100% scale */}
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
      </View>
    </Page>
  )
}
