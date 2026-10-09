import { pdf } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import {
  Document,
  ImageRun,
  Packer,
  Paragraph,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
} from 'docx'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// Raster resolution for the slip image. The LX-310 prints at 240x216dpi max,
// so 300dpi is already beyond what the printer can resolve — text stays
// crisp without bloating the file.
const DPI = 300

// EMUs per inch — Word's unit for floating-object offsets.
const EMU_PER_IN = 914400

// Render page 1 of a react-pdf document (built with pageMode='landscape',
// i.e. a true 8x4in MediaBox that IS the slip) to a PNG ArrayBuffer.
async function slipToPng(doc) {
  const blob = await pdf(doc).toBlob()
  const data = await blob.arrayBuffer()
  const task = pdfjs.getDocument({ data })
  const loaded = await task.promise
  try {
    const page = await loaded.getPage(1)
    const viewport = page.getViewport({ scale: DPI / 72 })
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(viewport.width)
    canvas.height = Math.round(viewport.height)
    const ctx = canvas.getContext('2d')
    // White ground: 'values' mode slips have a transparent-ish white page,
    // and Word renders missing alpha as black in some viewers.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // intent 'print' — the right rendering intent for output that goes to
    // paper, and it also avoids pdf.js v6's display-intent paint loop, which
    // schedules via requestAnimationFrame and stalls forever in hidden or
    // throttled tabs.
    await page.render({ canvas, canvasContext: ctx, viewport, intent: 'print' }).promise
    const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    return png.arrayBuffer()
  } finally {
    task.destroy()
  }
}

// Build a .docx with the slip image at ACTUAL SIZE (8x4in), floating at the
// absolute top-left of the page. The section properties copy the exact
// sectPr of the operator's known-good Word document (JSW chart): Letter
// portrait 12240x15840 twips, 1in margins — portrait pages are never
// auto-rotated by the printer driver, which is why Word output always lands
// the right way up on the pre-printed stationery. The floating image is
// anchored to the PAGE (not the margins), so the 1in margins don't shift it.
export async function slipDocxBlob(doc) {
  const png = await slipToPng(doc)
  const docx = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 }, // twips: 8.5x11in Letter portrait
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720, gutter: 0 },
          },
        },
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                type: 'png',
                data: png,
                // px at Word's 96dpi reference: 8in x 4in actual size
                transformation: { width: 8 * 96, height: 4 * 96 },
                floating: {
                  horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
                  verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
                  behindDocument: false,
                  allowOverlap: true,
                },
              }),
            ],
          }),
        ],
      },
    ],
  })
  return Packer.toBlob(docx)
}
