import { useEffect, useRef, useState } from 'react'
import Board3D from './Board3D.jsx'
import PartInfoCard from './PartInfoCard.jsx'
import { devices } from '../data/devices.js'
import {
  MousePointerClick,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const AUTO_MS = 5000

export default function DeviceCarousel({ active, onActive }) {
  const [dis, setDis] = useState(false)
  const [sel, setSel] = useState(null)
  const paused = useRef(false)
  const [hovered, setHovered] = useState(false)

  const device = devices[active]

  // Auto change every 5 seconds
  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current) return

      onActive((a) => (a + 1) % devices.length)
    }, AUTO_MS)

    return () => clearInterval(t)
  }, [onActive])

  // Reset when device changes
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

  // Previous
  const prev = () => {
    onActive(
      (a) => (a - 1 + devices.length) % devices.length
    )
  }

  // Next
  const next = () => {
    onActive(
      (a) => (a + 1) % devices.length
    )
  }

  return (
    <div
      className="device-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      style={{
        position: 'relative',
        width: '100%'
      }}
    >

      {/* ==============================
          DEVICE IMAGE / 3D AREA
      =============================== */}

      <div
        className="device-stage"
        onMouseEnter={() => setDis(true)}
        onMouseLeave={() => {
          if (!sel) setDis(false)
        }}
        style={{
          position: 'relative',
          width: '100%'
        }}
      >

        {/* DEVICE */}

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


        {/* ==============================
            LEFT ARROW
        =============================== */}

        <button
          onClick={prev}
          aria-label="Previous device"
          title="Previous device"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',

            width: '50px',
            height: '50px',

            border: 'none',
            borderRadius: '50%',

            background: 'linear-gradient(135deg, var(--cyan), var(--accent))',
            color: '#fff',

            boxShadow: '0 6px 18px rgba(224, 24, 156, 0.35), 0 0 14px var(--glow-cyan)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            cursor: 'pointer',

            zIndex: 100,

            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, #0cc3dd, #f02ab0)'
            e.currentTarget.style.transform =
              'translateY(-50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, var(--cyan), var(--accent))'
            e.currentTarget.style.transform =
              'translateY(-50%)'
          }}
        >
          <ChevronLeft size={30} strokeWidth={2.5} />
        </button>


        {/* ==============================
            RIGHT ARROW
        =============================== */}

        <button
          onClick={next}
          aria-label="Next device"
          title="Next device"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',

            width: '50px',
            height: '50px',

            border: 'none',
            borderRadius: '50%',

            background: 'linear-gradient(135deg, var(--cyan), var(--accent))',
            color: '#fff',

            boxShadow: '0 6px 18px rgba(224, 24, 156, 0.35), 0 0 14px var(--glow-cyan)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            cursor: 'pointer',

            zIndex: 100,

            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, #0cc3dd, #f02ab0)'
            e.currentTarget.style.transform =
              'translateY(-50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, var(--cyan), var(--accent))'
            e.currentTarget.style.transform =
              'translateY(-50%)'
          }}
        >
          <ChevronRight size={30} strokeWidth={2.5} />
        </button>

      </div>


      {/* ==============================
          DEVICE TABS
      =============================== */}

      <div
        className="device-tabs"
        role="tablist"
        aria-label="Choose a device"
      >
        {devices.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={active === i}
            className={`device-tab${
              active === i ? ' active' : ''
            }`}
            onClick={() => onActive(i)}
          >
            {d.name}
          </button>
        ))}
      </div>


      {/* ==============================
          DEVICE META
      =============================== */}

      <div className="device-meta">
        <h3>{device.full}</h3>
        <span>{device.tag}</span>
      </div>


      {/* ==============================
          SCENE HINT
      =============================== */}

      <div className="scene-hint">
        <MousePointerClick size={16} />

        Hover the device to disassemble it · click a part
        to open its details · switches device every 5s
      </div>


      {/* ==============================
          DOTS
      =============================== */}

      <div className="device-dots">
        {devices.map((d, i) => (
          <button
            key={d.id}
            className={`dot${
              active === i ? ' active' : ''
            }${
              active === i && hovered ? ' paused' : ''
            }`}
            onClick={() => onActive(i)}
            aria-label={`Show ${d.name}`}
          />
        ))}
      </div>


      {/* ==============================
          MOBILE PARTS
      =============================== */}

      <div className="mobile-chips">
        {device.parts.map((c) => (
          <button
            key={c.id}
            className={`mobile-chip${
              c.id === sel?.id ? ' active' : ''
            }`}
            onClick={() => {
              setDis(true)
              setSel(c)
            }}
          >
            {c.name}
          </button>
        ))}
      </div>


      {/* ==============================
          PART INFO
      =============================== */}

      {sel && (
        <PartInfoCard
          part={sel}
          onClose={() => {
            setSel(null)
            setDis(false)
          }}
        />
      )}

    </div>
  )
}
