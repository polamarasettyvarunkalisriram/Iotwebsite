import { useEffect, useState } from 'react'
import Board3D from './Board3D.jsx'
import PartInfoCard from './PartInfoCard.jsx'
import { devices } from '../data/devices.js'
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function DeviceCarousel({ active, onActive }) {
  const [dis, setDis] = useState(false)
  const [sel, setSel] = useState(null)

  const device = devices[active]

  // Reset when device changes
  useEffect(() => {
    setDis(false)
    setSel(null)
  }, [active])

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
          className="device-nav device-nav-prev"
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
          className="device-nav device-nav-next"
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
