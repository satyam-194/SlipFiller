#!/usr/bin/env python3
"""
Build LX310Dot.ttf — an Epson LX-310 9-pin draft typeface — from the
character-generator bitmaps in lx310-glyphs.py.

Why a generated font instead of an off-the-shelf one: the file this project
shipped as "DotMatrix.ttf" was Google's Doto Black, a decorative face built
from perfectly round, evenly spaced, *non-overlapping* dots on a square grid.
A real LX-310 does not look like that. Its dots are 1/60in across but step
1/120in horizontally and 1/72in vertically, so neighbouring dots overlap by
about half their diameter and strokes read as slightly lumpy continuous lines.
Reproducing that needs control over dot radius vs. pitch, which only a
generated outline gives us.

Each lit pin becomes a circle, approximated by four cubic Bezier arcs. Dots
are emitted as separate overlapping contours, all wound the same direction,
and the PDF/TrueType non-zero winding fill merges them into one black shape —
no boolean union needed, and overlaps stay solid rather than knocking out.

Metrics (units per em = 1000, matching the PDF text space the slips use):
  - Column pitch (1/120in) and row pitch (1/72in) are expressed as a fraction
    of the 1/10in character cell, so the em maps to exactly one 10 CPI cell:
    advance = 1000 units = 1/10in. Setting fontSize = N pt therefore prints at
    N/7.2 characters per inch; fontSize 7.2 is true 10 CPI.
  - Cap height spans pins 1-7 (6 row steps); the baseline sits on pin 7.
"""

import importlib.util
import math
import os
import sys

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# ---------------------------------------------------------------- geometry
UPEM = 1000

# One character cell = 1/10 inch = 12 horizontal steps of 1/120 in.
H_STEPS_PER_CELL = 12
COL_PITCH = UPEM / H_STEPS_PER_CELL          # 83.33 units = 1/120 in

# Vertical pin pitch is 1/72 in. In units of the 1/10in-wide em that is
# (1/72) / (1/10) = 10/72 of the em.
ROW_PITCH = UPEM * (10.0 / 72.0)             # 138.89 units = 1/72 in

# Printed dot diameter is ~1/60 in, i.e. radius == one column step (1.0x).
# Nominal 1.0x is the geometric ideal, but the pin strikes through a ribbon
# onto paper, so what actually lands is a slightly smaller hard core with a
# soft edge. 0.85x reproduces that: dots still overlap enough that a stroke
# never breaks into separate beads, yet the scalloped edge stays visible, which
# is the single most recognisable feature of 9-pin draft output.
#
# Checked by rasterising GROSS 12345 at 0.72 / 0.85 / 1.08:
#   0.72x - dots separate, strokes fall apart (this is the failure mode of the
#           Doto face this font replaces)
#   1.08x - dots merge into solid bars; the dot character is lost, and at the
#           ~15pt the slips use it would blob on a 600dpi laser
#   0.85x - connected but visibly scalloped at both 15pt and 20pt
DOT_RADIUS = COL_PITCH * 0.85

# Baseline is pin 7 (row index 6). Rows above it are positive y.
BASELINE_ROW = 6

# Leave the left sidebearing at zero: Epson starts inking in the first column
# of the cell, and the slips position each value by its left edge.
X_ORIGIN = COL_PITCH * 0.5   # centre of the first dot column

# A dot is drawn as 8 quadratic arcs of 45 deg each. TrueType `glyf` (format 0)
# stores quadratics only, so going straight to quadratic avoids a cubic->quad
# conversion pass. For a 45 deg arc the off-curve control point sits at radius
# r / cos(22.5 deg) on the angle bisector; with r ~= 90 units the worst-case
# radial error is well under a tenth of a unit, far below the rasteriser's
# resolution at any print size.
N_ARCS = 8


def row_to_y(row):
    """Pin row index (0 = top pin) -> y in font units, baseline at row 6."""
    return (BASELINE_ROW - row) * ROW_PITCH


def draw_dot(pen, cx, cy, r):
    """One round printed dot as N_ARCS quadratic arcs."""
    step = 2 * math.pi / N_ARCS
    # Control points lie on the bisector of each arc, pushed out so the curve
    # passes through the two on-curve endpoints at radius r.
    ctrl_r = r / math.cos(step / 2)

    def on(i):
        a = i * step
        return (cx + r * math.cos(a), cy + r * math.sin(a))

    def ctrl(i):
        a = (i + 0.5) * step
        return (cx + ctrl_r * math.cos(a), cy + ctrl_r * math.sin(a))

    pen.moveTo(on(0))
    for i in range(N_ARCS):
        pen.qCurveTo(ctrl(i), on((i + 1) % N_ARCS))
    pen.closePath()


def build_glyph(rows):
    """Row strings of '#'/'.' -> a glyph of overlapping dot contours.

    Rows are authored top-to-bottom in reading orientation; column index is
    the position within the row, which is the print head's horizontal step.
    """
    pen = TTGlyphPen(None)
    for ri, row in enumerate(rows):
        y = row_to_y(ri)
        for ci, cell in enumerate(row):
            if cell == '#':
                draw_dot(pen, X_ORIGIN + ci * COL_PITCH, y, DOT_RADIUS)
    return pen.glyph()


# ---------------------------------------------------------------- glyph data
spec = importlib.util.spec_from_file_location(
    'lx310_glyphs', os.path.join(HERE, 'lx310-glyphs.py'))
GL = importlib.util.module_from_spec(spec)
spec.loader.exec_module(GL)
GLYPHS = GL.GLYPHS

# Every glyph advances one full 10 CPI cell — the font is strictly monospaced,
# exactly like the printer's draft mode.
ADVANCE = UPEM

AGL = {
    ' ': 'space', '!': 'exclam', '"': 'quotedbl', '#': 'numbersign',
    '$': 'dollar', '%': 'percent', '&': 'ampersand', "'": 'quotesingle',
    '(': 'parenleft', ')': 'parenright', '*': 'asterisk', '+': 'plus',
    ',': 'comma', '-': 'hyphen', '.': 'period', '/': 'slash',
    ':': 'colon', ';': 'semicolon', '<': 'less', '=': 'equal',
    '>': 'greater', '?': 'question', '@': 'at',
    '[': 'bracketleft', '\\': 'backslash', ']': 'bracketright',
    '^': 'asciicircum', '_': 'underscore', '`': 'grave',
    '{': 'braceleft', '|': 'bar', '}': 'braceright', '~': 'asciitilde',
    '₹': 'rupeeindian',
}


def glyph_name(ch):
    if ch in AGL:
        return AGL[ch]
    if ch.isdigit():
        return ['zero', 'one', 'two', 'three', 'four',
                'five', 'six', 'seven', 'eight', 'nine'][int(ch)]
    if ch.isalpha() and ord(ch) < 128:
        return ch
    return 'uni%04X' % ord(ch)


def main():
    out = os.path.join(ROOT, 'public', 'fonts', 'LX310Dot.ttf')

    order = ['.notdef'] + [glyph_name(c) for c in GLYPHS]
    # Guard against a duplicate name silently dropping a glyph.
    assert len(order) == len(set(order)), 'duplicate glyph names'

    fb = FontBuilder(UPEM, isTTF=True)
    fb.setupGlyphOrder(order)

    cmap = {ord(c): glyph_name(c) for c in GLYPHS}
    fb.setupCharacterMap(cmap)

    glyphs = {'.notdef': TTGlyphPen(None).glyph()}
    metrics = {'.notdef': (ADVANCE, 0)}
    for ch, cols in GLYPHS.items():
        name = glyph_name(ch)
        glyphs[name] = build_glyph(cols)
        metrics[name] = (ADVANCE, 0)

    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)

    cap_height = int(round(BASELINE_ROW * ROW_PITCH))          # pins 1-7
    descender = int(round(-2 * ROW_PITCH - DOT_RADIUS))        # pins 8-9
    ascender = int(round(cap_height + DOT_RADIUS))

    fb.setupHorizontalHeader(ascent=ascender, descent=descender, lineGap=0)

    fb.setupNameTable({
        'familyName': 'LX310Dot',
        'styleName': 'Regular',
        'uniqueFontIdentifier': 'LX310Dot-Regular-1.0',
        'fullName': 'LX310Dot Regular',
        'psName': 'LX310Dot-Regular',
        'version': 'Version 1.0',
        'manufacturer': 'Generated from Epson 9-pin draft character bitmaps',
        'designer': 'SlipFiller',
        'description': (
            'Epson LX-310 9-pin draft typeface. Monospaced at 10 CPI: '
            'one em = 1/10 inch, so fontSize 7.2pt prints true 10 CPI.'),
    })

    # x-height: lowercase sits on pins 3-7 (rows 2..6) -> 4 row steps.
    fb.setupOS2(
        sTypoAscender=ascender,
        sTypoDescender=descender,
        sTypoLineGap=0,
        usWinAscent=ascender,
        usWinDescent=abs(descender),
        sCapHeight=cap_height,
        sxHeight=int(round(4 * ROW_PITCH)),
        achVendID='SLIP',
        fsType=0,
        # 9 = Monospaced in the PANOSE proportion field; react-pdf and PDF
        # viewers use this to avoid substituting a proportional fallback.
        panose=dict(bFamilyType=2, bSerifStyle=11, bWeight=6, bProportion=9,
                    bContrast=0, bStrokeVariation=0, bArmStyle=0,
                    bLetterForm=0, bMidline=0, bXHeight=0),
    )
    fb.setupPost(isFixedPitch=1)
    fb.setupDummyDSIG()

    fb.save(out)

    # Reload and assert the result is coherent before anything depends on it.
    f = TTFont(out)
    got = set(f.getBestCmap().keys())
    want = {ord(c) for c in GLYPHS}
    missing = want - got
    assert not missing, 'cmap missing %r' % missing
    widths = {f['hmtx'][glyph_name(c)][0] for c in GLYPHS}
    assert widths == {ADVANCE}, 'not monospaced: %r' % widths

    print('wrote %s (%d bytes)' % (out, os.path.getsize(out)))
    print('  glyphs      : %d' % len(GLYPHS))
    print('  upem        : %d  (= 1/10 in, one 10 CPI cell)' % UPEM)
    print('  col pitch   : %.2f units (1/120 in)' % COL_PITCH)
    print('  row pitch   : %.2f units (1/72 in)' % ROW_PITCH)
    print('  dot radius  : %.2f units (%.2fx col pitch)'
          % (DOT_RADIUS, DOT_RADIUS / COL_PITCH))
    print('  cap height  : %d' % cap_height)
    print('  descender   : %d' % descender)
    return 0


if __name__ == '__main__':
    sys.exit(main())
