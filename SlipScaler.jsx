import React, { useEffect, useRef, useState } from 'react'

// Scales a fixed-size slip down to fit its container width (mobile friendly).
export default function SlipScaler({ width = 850, height = 458, children }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{ width: width * scale, height: height * scale, margin: '0 auto', overflow: 'hidden' }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
