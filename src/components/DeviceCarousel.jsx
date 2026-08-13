import { useEffect, useRef, useState } from 'react'
import Board3D from './Board3D.jsx'
import PartInfoCard from './PartInfoCard.jsx'
import { devices } from '../data/devices.js'
import { MousePointerClick, ChevronLeft, ChevronRight } from 'lucide-react'

const AUTO_MS = 5000

export default function DeviceCarousel({ active, onActive }) {
  const [dis, setDis] = useState(false)
  const [sel, setSel] = useState(null)
  const paused = useRef(false)
  const [hovered, setHovered] = useState(false)
  const device = devices[active]

  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current) return
      onActive((a) => (a + 1) % devices.length)
    }, AUTO_MS)
    return () => clearInterval(t)
  }, [onActive])

  useEffect(() => {
    setDis(false)
    setSel(null)
  }, [active])

  const pause = () => {
    paused.current = true
    setHovered(true)
  }
  const resume = () => {
    paused.current = false
    setHovered(false)
  }

  const prev = () => onActive((a) => (a - 1 + devices.length) % devices.length)
  const next = () => onActive((a) => (a + 1) % devices.length)

  return (
    <div
      className="device-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="device-tabs" role="tablist" aria-label="Choose a device">
        {devices.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={active === i}
            className={`device-tab${active === i ? ' active' : ''}`}
            onClick={() => onActive(i)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div
        className="device-stage"
        onMouseEnter={() => setDis(true)}
        onMouseLeave={() => {
          if (!sel) setDis(false)
        }}
      >
        <Board3D
          key={device.id}
          device={device}
          disassembled={dis}
          onSelect={(comp) => {
            setDis(true)
            setSel(comp)
          }}
          selectedId={sel?.id}
        />
      </div>

      <div className="device-arrows">
        <button className="zoom-btn" onClick={prev} aria-label="Previous device" title="Previous device">
          <ChevronLeft size={18} />
        </button>
        <button className="zoom-btn" onClick={next} aria-label="Next device" title="Next device">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="device-meta">
        <h3>{device.full}</h3>
        <span>{device.tag}</span>
      </div>

      <div className="scene-hint">
        <MousePointerClick size={16} />
        Hover the device to disassemble it · click a part to open its details · switches device every 5s
      </div>

      <div className="device-dots">
        {devices.map((d, i) => (
          <button
            key={d.id}
            className={`dot${active === i ? ' active' : ''}${active === i && hovered ? ' paused' : ''}`}
            onClick={() => onActive(i)}
            aria-label={`Show ${d.name}`}
          />
        ))}
      </div>

      <div className="mobile-chips">
        {device.parts.map((c) => (
          <button
            key={c.id}
            className={`mobile-chip${c.id === sel?.id ? ' active' : ''}`}
            onClick={() => {
              setDis(true)
              setSel(c)
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {sel && <PartInfoCard part={sel} onClose={() => { setSel(null); setDis(false) }} />}
    </div>
  )
}
