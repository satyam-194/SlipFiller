import React from 'react'
import { Page, View } from '@react-pdf/renderer'

// Physical page: 8in x 4in continuous paper, 72pt/in
export const PRINT_W = 8 * 72 // 576
export const PRINT_H = 4 * 72 // 288
// Printers can't reach the paper edge; keep ~4mm clear on every side
export const SAFE = 12

export const mmToPt = (mm) => (mm * 72) / 25.4

// Shared 8x4in page. Lays out a design canvas at its original size, then
// uniformly scales it (aspect preserved) centered inside the safe area.
export default function PrintPage({ designW, designH, bg, debug = false, children }) {
  const scale = Math.min((PRINT_W - 2 * SAFE) / designW, (PRINT_H - 2 * SAFE) / designH)
  const offX = (PRINT_W - designW * scale) / 2
  const offY = (PRINT_H - designH * scale) / 2
  return (
    // wrap=false: the canvas is laid out at full design size then scaled down,
    // so pagination must not split it across pages. With wrap off, react-pdf
    // derives page height from in-flow content, hence the full-size root View.
    <Page size={[PRINT_W, PRINT_H]} wrap={false} style={{ backgroundColor: bg, fontFamily: 'Helvetica' }}>
      <View style={{ width: PRINT_W, height: PRINT_H }}>
        <View
          style={{
            position: 'absolute',
            left: offX,
            top: offY,
            width: designW,
            height: designH,
            transform: `scale(${scale})`,
            transformOrigin: '0% 0%',
          }}
        >
          {children}
        </View>

        {/* Alignment-test guides: paper edge (red) + safe printable area (green) */}
        {debug && (
          <>
            <View style={{
              position: 'absolute', left: 0, top: 0,
              width: PRINT_W - 1, height: PRINT_H - 1,
              border: '1 dashed #ff0000',
            }} />
            <View style={{
              position: 'absolute', left: SAFE, top: SAFE,
              width: PRINT_W - 2 * SAFE, height: PRINT_H - 2 * SAFE,
              border: '0.75 dashed #00a000',
            }} />
          </>
        )}
      </View>
    </Page>
  )
}
