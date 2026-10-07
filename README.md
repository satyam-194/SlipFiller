# SlipFiller — Dot Matrix Slip Printing (Phase 1)

Prints weigh-bridge slips in two layers on **8×4 inch continuous paper**:

1. **Blank stationery** — the full slip design with empty value slots. Printed
   once, in bulk, on a laser printer or at a print shop. This is the paper you
   load into the dot-matrix printer.
2. **Values overlay** — a white 8×4in PDF containing only the transaction
   values (serial no, vehicle, party, weights, dates, …) at exactly the same
   positions. Printed per-transaction by the dot-matrix printer onto the
   pre-printed slip.

Both layers render from the same component and coordinates, so they always
line up. Templates: Shree Jay Ambika, Jaynath, Krishna.

## Run

```bash
npm install
npm run dev   # http://localhost:5174
```

## Workflow

1. **Pre-print stationery**: pick a template → *Blank Stationery PDF* → print
   in bulk on 8×4in continuous paper (laser/offset, 100% / Actual Size).
2. **Load** the pre-printed continuous paper into the dot-matrix tractor feed
   and set the printer's **top-of-form** at the perforation.
3. **Calibrate**: *Print Test Values* onto one real slip. If the values sit
   off their slots, adjust **Feed Alignment X/Y** (in mm, saved per template)
   and repeat until aligned. Positive X moves values right, positive Y down.
4. **Daily use**: fill the form → *Print Values (Dot Matrix)* → the browser
   print dialog opens; choose the dot-matrix queue.

## Printer settings (both laser and dot matrix)

- Custom paper size **8 × 4 in**, margins 0 (macOS: Print dialog → Paper Size
  → Manage Custom Sizes; Windows: Print Server Properties → new form).
- **Scale 100% / Actual Size** — never "Fit to page" / "Shrink to fit".
- One page per sheet, no duplex. Each PDF page is exactly one slip.

## Modes / debug

Each slip component (`slips/*.jsx`) takes:

- `mode`: `'full'` (digital copy) | `'blank'` (stationery master) |
  `'values'` (dot-matrix overlay: white page, black values).
- `offsetX` / `offsetY` (pt): feed-alignment nudge, applied to values only.
- `debug`: dashed guides — red at the paper edge, green at the ~4mm safe
  printable boundary. Enable via the checkbox for alignment test prints.

## Notes

- `public/fonts/*.ttf` are patched copies from SlipGenerator (browser fontkit
  GPOS workaround) — don't replace them with freshly downloaded fonts.
- The Krishna design canvas is 850×600 (taller aspect than 2:1), so on 8×4
  paper it prints smaller with wider side margins — a uniform scale is used
  to avoid distortion.
- Phase 2 (optional): raw ESC/P text-mode printing through a small local
  print agent, if driver/graphics-mode dot-matrix printing is too slow.
