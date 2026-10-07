import React, { useState, useRef, useMemo, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import AmbikaSlip from './slips/AmbikaSlip.jsx'
import JaynathSlip from './slips/JaynathSlip.jsx'
import KrishnaSlip from './slips/KrishnaSlip.jsx'
import DhartiSlip from './slips/DhartiSlip.jsx'
import JaySlip from './slips/JaySlip.jsx'
import MarutiSlip from './slips/MarutiSlip.jsx'
import HarikrushnaSlip from './slips/HarikrushnaSlip.jsx'
import ViratSlip from './slips/ViratSlip.jsx'
import BhagwatiSlip from './slips/BhagwatiSlip.jsx'
import SatyanarayanSlip from './slips/SatyanarayanSlip.jsx'
import ShivSlip from './slips/ShivSlip.jsx'
import MurlidharSlip from './slips/MurlidharSlip.jsx'
import JaySatyanarayanSlip from './slips/JaySatyanarayanSlip.jsx'
import { mmToPt } from './slips/printSpec.jsx'
import SlipPreview from './SlipPreview.jsx'
import JaynathPreview from './JaynathPreview.jsx'
import KrishnaPreview from './KrishnaPreview.jsx'
import DhartiPreview from './DhartiPreview.jsx'
import JayPreview from './JayPreview.jsx'
import MarutiPreview from './MarutiPreview.jsx'
import HarikrushnaPreview from './HarikrushnaPreview.jsx'
import ViratPreview from './ViratPreview.jsx'
import BhagwatiPreview from './BhagwatiPreview.jsx'
import SatyanarayanPreview from './SatyanarayanPreview.jsx'
import ShivPreview from './ShivPreview.jsx'
import MurlidharPreview from './MurlidharPreview.jsx'
import JaySatyanarayanPreview from './JaySatyanarayanPreview.jsx'

const initialData = {
  serialNo: '40079',
  vehicleNo: 'GJ 03 BZ 0810',
  party: 'SHREE GANESH TRADERS',
  material: 'COAL',
  supplierName: '',
  charges: '60',
  gross: '1990',
  grossDate: '2026-10-07',
  grossTime: '11:58',
  tare: '',
  tareDate: '',
  tareTime: '',
  net: '',
  remark: '',
  weigherName: '',
}

// Max-length dummy values for the calibration print: printed onto one real
// pre-printed slip so the operator can check alignment of every field
const TEST_DATA = {
  serialNo: '88888',
  vehicleNo: 'GJ 88 XX 8888',
  party: 'CALIBRATION TEST PARTY NAME',
  material: 'TEST MATERIAL',
  supplierName: 'TEST SUPPLIER NAME',
  charges: '888',
  gross: '88888',
  grossDate: '2026-01-31',
  grossTime: '12:59',
  tare: '88888',
  tareDate: '2026-01-31',
  tareTime: '12:59',
  net: '88888',
  remark: 'TEST REMARK',
  weigherName: 'TESTNAME',
}

const TEMPLATES = [
  {
    id: 'ambika',
    name: 'Shree Jay Ambika',
    sub: 'Red slip • Mavdi Road, Rajkot',
    color: '#e13464',
    labels: { serialNo: 'Serial No.', party: 'Party', material: 'Material' },
    Preview: SlipPreview,
    Slip: AmbikaSlip,
  },
  {
    id: 'jaynath',
    name: 'Jaynath Weigh Bridge',
    sub: 'Blue slip • Gondal Road, Rajkot',
    color: '#3c5490',
    labels: { serialNo: 'Ticket No.', party: 'Customer Name', material: 'Item Name' },
    Preview: JaynathPreview,
    Slip: JaynathSlip,
  },
  {
    id: 'krishna',
    name: 'Krishna Weigh Bridge',
    sub: 'Orange slip • Mavdi Plot, Rajkot',
    color: '#e14b2a',
    labels: { serialNo: 'No.', party: 'Seller (વેચનાર)', material: 'Material (મીલની જાત)' },
    Preview: KrishnaPreview,
    Slip: KrishnaSlip,
  },
  {
    id: 'dharti',
    name: 'Dharti Weigh Bridge',
    sub: 'Orange slip • Dhebar Road, Atika, Rajkot',
    color: '#e2641e',
    labels: { serialNo: 'RST No.', party: 'Receiver', material: 'Material' },
    Preview: DhartiPreview,
    Slip: DhartiSlip,
  },
  {
    id: 'jay',
    name: 'Jay Weigh Bridge',
    sub: 'Blue slip • Atika, Patel Chowk, Rajkot',
    color: '#2b4b94',
    labels: { serialNo: 'Serial No.', party: 'Supplier', material: 'Product' },
    Preview: JayPreview,
    Slip: JaySlip,
  },
  {
    id: 'maruti',
    name: 'Shree Maruti Weighbridge',
    sub: 'Green slip • Kothariya, Rajkot',
    color: '#2f9e4f',
    labels: { serialNo: 'Serial No.', party: 'Party', material: 'Material' },
    Preview: MarutiPreview,
    Slip: MarutiSlip,
  },
  {
    id: 'harikrushna',
    name: 'Harikrushna Weigh Bridge',
    sub: 'Blue slip • SIDC Road, Veraval (Shapar), Rajkot',
    color: '#1f3864',
    labels: { serialNo: 'Serial No.', party: 'Party', material: 'Material' },
    Preview: HarikrushnaPreview,
    Slip: HarikrushnaSlip,
  },
  {
    id: 'virat',
    name: 'Virat Weigh-Bridge',
    sub: 'Crimson slip • Mavdi Main Road, Rajkot',
    color: '#b5245c',
    labels: { serialNo: 'Serial No.', party: 'Party', material: 'Material' },
    Preview: ViratPreview,
    Slip: ViratSlip,
  },
  {
    id: 'bhagwati',
    name: 'Bhagwati Weigh Bridge',
    sub: 'Red slip • Kuvadva G.I.D.C., Rajkot',
    color: '#d42027',
    labels: { serialNo: 'Serial No.', party: 'Party', material: 'Material' },
    Preview: BhagwatiPreview,
    Slip: BhagwatiSlip,
    id: 'satyanarayan',
    name: 'Shree Satyanarayan Weigh-Bridge (50 Ton)',
    sub: 'Red/Pink slip • Samrat Ind. Area, Gondal Road, Rajkot',
    color: '#b83344',
    labels: { serialNo: 'RST NO.', party: 'Supplier', material: 'Material' },
    Preview: SatyanarayanPreview,
    Slip: SatyanarayanSlip,
  },
  {
    id: 'shiv',
    name: 'Shiv Weigh-Bridge',
    sub: 'Red/Blue slip • Shapar (Veraval), Rajkot',
    color: '#b82434',
    labels: { serialNo: 'SERIAL No.', party: 'SUPPLIER', material: 'MATIRIAL' },
    Preview: ShivPreview,
    Slip: ShivSlip,
  },
  {
    id: 'murlidhar',
    name: 'Murlidhar Weigh-Bridge',
    sub: 'Blue/Yellow slip • GIDC Metoda, Rajkot',
    color: '#274492',
    labels: { serialNo: 'SR. NO', party: 'RECEIVER', material: 'MATERIAL' },
    Preview: MurlidharPreview,
    Slip: MurlidharSlip,
  },
  {
    id: 'jaysatyanarayan',
    name: 'Shree Jay Satyanarayan Weigh-Bridge',
    sub: 'Red/Pink slip • Vavdi, Gondal Road, Rajkot',
    color: '#982435',
    labels: { serialNo: 'RST NO.', party: 'SUPPLIER', material: 'MATERIAL' },
    Preview: JaySatyanarayanPreview,
    Slip: JaySatyanarayanSlip,
  },
]

const OFFSETS_KEY = 'slipfiller-offsets'

function loadOffsets() {
  try {
    return JSON.parse(localStorage.getItem(OFFSETS_KEY)) || {}
  } catch {
    return {}
  }
}

// Searchable template dropdown. Scales past the handful of slips that fit as
// stacked cards: matches on name + sub (town/road), so "gondal" or "orange"
// finds a slip as readily as its company name.
function TemplateSelect({ templates, value, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const selected = templates.find((t) => t.id === value)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return templates
    // every term must hit somewhere, so "krishna mavdi" narrows rather than widens
    const terms = q.split(/\s+/)
    return templates.filter((t) => {
      const hay = `${t.name} ${t.sub}`.toLowerCase()
      return terms.every((term) => hay.includes(term))
    })
  }, [templates, query])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Focus the search box when the menu opens, and reset for the next open
  useEffect(() => {
    if (open) inputRef.current?.focus()
    else {
      setQuery('')
      setActive(0)
    }
  }, [open])

  // Keep the highlighted row in view during keyboard nav
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  // Clamp the highlight when filtering shrinks the list
  useEffect(() => setActive(0), [query])

  const choose = (t) => {
    onSelect(t.id)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return setOpen(true)
      if (!matches.length) return
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + dir + matches.length) % matches.length)
    } else if (e.key === 'Enter') {
      if (open && matches[active]) {
        e.preventDefault()
        choose(matches[active])
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
      }
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      {/* Trigger — shows the current slip exactly as the old card did */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full text-left rounded-xl border-2 px-3 py-2.5 bg-white shadow-sm hover:shadow transition flex items-center gap-3"
        style={{ borderColor: selected ? selected.color : '#e5e7eb' }}
      >
        <span className="inline-block w-5 h-5 rounded shrink-0" style={{ backgroundColor: selected?.color }} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold truncate" style={{ color: selected?.color }}>
            {selected?.name || 'Select template'}
          </span>
          <span className="block text-[11px] text-gray-400 truncate">{selected?.sub}</span>
        </span>
        <span className={`text-gray-400 text-xs shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div ref={listRef} role="listbox" className="max-h-72 overflow-y-auto py-1">
            {matches.map((t, i) => {
              const isSel = t.id === value
              return (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(t)}
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 ${i === active ? 'bg-slate-50' : ''}`}
                >
                  <span className="inline-block w-4 h-4 rounded shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold truncate" style={{ color: t.color }}>{t.name}</span>
                    <span className="block text-[11px] text-gray-400 truncate">{t.sub}</span>
                  </span>
                  {isSel && <span className="text-xs font-bold shrink-0" style={{ color: t.color }}>✓</span>}
                </button>
              )
            })}

            {!matches.length && (
              <div className="px-3 py-6 text-center text-xs text-gray-400">No templates match “{query}”</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [data, setData] = useState(initialData)
  const [templateId, setTemplateId] = useState('jaysatyanarayan')
  const [offsets, setOffsets] = useState(loadOffsets)
  const [debug, setDebug] = useState(false)
  const [busy, setBusy] = useState(false)

  const template = TEMPLATES.find((t) => t.id === templateId)
  const { labels, Preview, Slip } = template
  const isJaynath = templateId === 'jaynath'
  const isKrishna = templateId === 'krishna'
  const isMurlidhar = templateId === 'murlidhar'

  const off = offsets[templateId] || { x: 0, y: 0 }
  const setOff = (axis, raw) => {
    const v = parseFloat(raw) || 0
    const next = { ...offsets, [templateId]: { ...off, [axis]: v } }
    setOffsets(next)
    localStorage.setItem(OFFSETS_KEY, JSON.stringify(next))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => {
      const updated = { ...prev, [name]: value }
      const g = parseFloat(updated.gross) || 0
      const t = parseFloat(updated.tare) || 0
      updated.net = g > 0 && t > 0 ? (g - t).toString() : ''
      return updated
    })
  }

  // Build the slip document for a given layer/mode. The feed offset only
  // applies to what the dot matrix prints (values); blank/full get none.
  const makeDoc = (mode, d = data) => (
    <Slip
      data={d}
      mode={mode}
      offsetX={mode === 'values' ? mmToPt(off.x) : 0}
      offsetY={mode === 'values' ? mmToPt(off.y) : 0}
      debug={debug}
    />
  )

  const withBusy = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  const download = (mode, d = data) =>
    withBusy(async () => {
      const blob = await pdf(makeDoc(mode, d)).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.id}_${mode}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    })

  // Print via hidden iframe so the operator picks the dot-matrix queue
  // in the system dialog (at 100% / Actual Size)
  const printDoc = (mode, d = data) =>
    withBusy(async () => {
      const blob = await pdf(makeDoc(mode, d)).toBlob()
      const url = URL.createObjectURL(blob)
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        // keep the iframe/url alive — revoking too early cancels the print job
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 60000)
      }
      document.body.appendChild(iframe)
    })

  const inputClass = 'border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white'
  const labelClass = 'text-xs font-semibold text-gray-600 mb-1 block'
  const btnClass = 'font-bold px-4 py-2.5 rounded-lg text-sm shadow transition disabled:opacity-50 hover:opacity-90 text-left'

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b-2 border-slate-800 px-4 md:px-8 py-3 flex items-center gap-3">
        <span className="text-2xl">🖨️</span>
        <div>
          <div className="text-lg font-extrabold text-slate-800 leading-none">SLIPFILLER — DOT MATRIX SLIP PRINTING</div>
          <div className="text-xs text-slate-400">Pre-printed 8×4in stationery + values overlay • {template.name}</div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 px-4 py-8">
          <div className="sticky top-6 space-y-3">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">Slip Template</div>
            <TemplateSelect templates={TEMPLATES} value={templateId} onSelect={setTemplateId} />

            {/* Print panel */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Print / Download</div>

              <button onClick={() => printDoc('values')} disabled={busy}
                className={`${btnClass} w-full text-white`} style={{ backgroundColor: template.color }}>
                🖨️ Print Values (Dot Matrix)
              </button>
              <button onClick={() => printDoc('values', TEST_DATA)} disabled={busy}
                className={`${btnClass} w-full bg-slate-700 text-white`}>
                🧪 Print Test Values (calibration)
              </button>
              <button onClick={() => download('values')} disabled={busy}
                className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>
                ⬇️ Values PDF
              </button>
              <button onClick={() => download('blank')} disabled={busy}
                className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>
                ⬇️ Blank Stationery PDF
              </button>
              <button onClick={() => download('full')} disabled={busy}
                className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>
                ⬇️ Full Slip PDF
              </button>

              {/* Feed alignment */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Feed Alignment (mm)</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={labelClass}>X (→ right)</label>
                    <input type="number" step="0.5" value={off.x} onChange={(e) => setOff('x', e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Y (↓ down)</label>
                    <input type="number" step="0.5" value={off.y} onChange={(e) => setOff('y', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Shifts only the printed values. Saved per template.</p>
                <label className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
                  Debug guides (paper edge + safe area)
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 py-8 space-y-8">
          {/* Mobile template selector */}
          <div className="md:hidden">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">Slip Template</div>
            <TemplateSelect templates={TEMPLATES} value={templateId} onSelect={setTemplateId} />
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2">📋 Fill Slip Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><label className={labelClass}>{labels.serialNo}</label><input className={inputClass} name="serialNo" value={data.serialNo} onChange={handleChange} placeholder="e.g. 1001" /></div>
              <div><label className={labelClass}>Vehicle No.</label><input className={inputClass} name="vehicleNo" value={data.vehicleNo} onChange={handleChange} placeholder="e.g. GJ03AB1234" /></div>
              <div><label className={labelClass}>{labels.party}</label><input className={inputClass} name="party" value={data.party} onChange={handleChange} placeholder={`${labels.party} name`} /></div>
              <div><label className={labelClass}>{labels.material}</label><input className={inputClass} name="material" value={data.material} onChange={handleChange} placeholder="e.g. Sand" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {(isJaynath || isKrishna || isMurlidhar) && (
                <div><label className={labelClass}>{isKrishna ? 'Buyer (ખરીદનાર)' : 'Supplier Name'}</label><input className={inputClass} name="supplierName" value={data.supplierName} onChange={handleChange} placeholder={isKrishna ? 'Buyer name' : 'Supplier name'} /></div>
              )}
              <div><label className={labelClass}>Charges (₹)</label><input className={inputClass} name="charges" value={data.charges} onChange={handleChange} placeholder="e.g. 180" /></div>
              {isKrishna && (
                <>
                  <div><label className={labelClass}>Remark (રીમાર્ક)</label><input className={inputClass} name="remark" value={data.remark} onChange={handleChange} placeholder="Remark" /></div>
                  <div><label className={labelClass}>Weigher Name (તોલનાર)</label><input className={inputClass} name="weigherName" value={data.weigherName} onChange={handleChange} placeholder="e.g. KISHORBHAI" /></div>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><label className={labelClass}>Gross Weight (KG)</label><input className={inputClass} name="gross" type="number" value={data.gross} onChange={handleChange} placeholder="e.g. 15000" /></div>
              <div><label className={labelClass}>Gross Date</label><input className={inputClass} name="grossDate" type="date" value={data.grossDate} onChange={handleChange} /></div>
              <div><label className={labelClass}>Gross Time</label><input className={inputClass} name="grossTime" type="time" value={data.grossTime} onChange={handleChange} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><label className={labelClass}>Tare Weight (KG)</label><input className={inputClass} name="tare" type="number" value={data.tare} onChange={handleChange} placeholder="e.g. 5000" /></div>
              <div><label className={labelClass}>Tare Date</label><input className={inputClass} name="tareDate" type="date" value={data.tareDate} onChange={handleChange} /></div>
              <div><label className={labelClass}>Tare Time</label><input className={inputClass} name="tareTime" type="time" value={data.tareTime} onChange={handleChange} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className={labelClass}>Net Weight (KG) — Auto Calculated</label><input className={`${inputClass} bg-slate-50 font-bold`} name="net" value={data.net} readOnly placeholder="Auto calculated" /></div>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2">👁️ Live Preview — {template.name}</h2>
            <Preview data={data} />
          </div>

          {/* Mobile print panel */}
          <div className="md:hidden bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-2">
            <button onClick={() => printDoc('values')} disabled={busy}
              className={`${btnClass} w-full text-white`} style={{ backgroundColor: template.color }}>
              🖨️ Print Values (Dot Matrix)
            </button>
            <button onClick={() => printDoc('values', TEST_DATA)} disabled={busy} className={`${btnClass} w-full bg-slate-700 text-white`}>🧪 Print Test Values</button>
            <button onClick={() => download('values')} disabled={busy} className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>⬇️ Values PDF</button>
            <button onClick={() => download('blank')} disabled={busy} className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>⬇️ Blank Stationery PDF</button>
            <button onClick={() => download('full')} disabled={busy} className={`${btnClass} w-full bg-slate-100 text-slate-700 border border-slate-300`}>⬇️ Full Slip PDF</button>
          </div>
        </main>
      </div>
    </div>
  )
}
