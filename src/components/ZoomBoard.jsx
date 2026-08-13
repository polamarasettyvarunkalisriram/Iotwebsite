import { useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

const MIN = 0.7
const MAX = 4

export default function ZoomBoard({ children }) {
  const [zoom, setZoom] = useState(1)
  const areaRef = useRef(null)

  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const f = e.deltaY < 0 ? 1.15 : 0.87
      setZoom((z) => Math.min(MAX, Math.max(MIN, +(z * f).toFixed(2))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const step = (d) => setZoom((z) => Math.min(MAX, Math.max(MIN, +(z + d).toFixed(2))))

  return (
    <div className="zoom-board" ref={areaRef}>
      <div className="zoom-viewport">
        <div className="zoom-inner" style={{ transform: `scale(${zoom})` }}>
          {children}
        </div>
      </div>
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => step(-0.25)} aria-label="Zoom out" title="Zoom out">
          <ZoomOut size={17} />
        </button>
        <button className="zoom-pct" onClick={() => setZoom(1)} title="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button className="zoom-btn" onClick={() => step(0.25)} aria-label="Zoom in" title="Zoom in">
          <ZoomIn size={17} />
        </button>
        <button className="zoom-btn zoom-reset" onClick={() => setZoom(1)} aria-label="Reset zoom" title="Reset to 100%">
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  )
}
