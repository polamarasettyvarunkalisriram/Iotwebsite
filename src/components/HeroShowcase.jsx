import { useState, useRef } from 'react'
import heroBoard from '../assets/hero-board.jpg'

/* Parts positioned over the photo (percent of the board image).
   Clicking a part lifts it out of the board in 3D; clicking again puts it back. */
const PARTS = [
  {
    id: 'mcu',
    name: 'Microcontroller',
    short: 'The brain of the board',
    L: 32, T: 28, W: 36, H: 32,
    fx: 0, fy: -120, fz: 70, fr: -4,
  },
  {
    id: 'usb',
    name: 'USB Port',
    short: 'Power + data connection',
    L: 4, T: 72, W: 26, H: 20,
    fx: 0, fy: 130, fz: 60, fr: 3,
  },
  {
    id: 'gpio',
    name: 'GPIO Header',
    short: 'Connects sensors and modules',
    L: 2, T: 6, W: 16, H: 46,
    fx: -150, fy: 0, fz: 50, fr: -6,
  },
  {
    id: 'power',
    name: 'Power Connector',
    short: 'External power input',
    L: 2, T: 2, W: 22, H: 18,
    fx: -140, fy: -40, fz: 55, fr: 5,
  },
  {
    id: 'reg',
    name: 'Voltage Regulator',
    short: 'Keeps voltage steady',
    L: 74, T: 44, W: 20, H: 24,
    fx: 150, fy: 20, fz: 65, fr: -5,
  },
  {
    id: 'xtal',
    name: 'Crystal Oscillator',
    short: 'Sets the clock timing',
    L: 58, T: 42, W: 12, H: 13,
    fx: 40, fy: -110, fz: 60, fr: 8,
  },
  {
    id: 'leds',
    name: 'Status LEDs',
    short: 'Power and activity lights',
    L: 80, T: 2, W: 16, H: 11,
    fx: 120, fy: -90, fz: 50, fr: 7,
  },
]

const DOTS = [
  { x: '12%', y: '22%', d: '0s' },
  { x: '84%', y: '18%', d: '-2.2s' },
  { x: '20%', y: '76%', d: '-3.8s' },
  { x: '78%', y: '70%', d: '-1.4s' },
  { x: '48%', y: '12%', d: '-5.1s' },
  { x: '60%', y: '86%', d: '-6.4s' },
]

function bgFor(p) {
  const sizeX = (100 / p.W) * 100
  const sizeY = (100 / p.H) * 100
  const posX = (p.L / (100 - p.W)) * 100
  const posY = (p.T / (100 - p.H)) * 100
  return {
    left: `${p.L}%`,
    top: `${p.T}%`,
    width: `${p.W}%`,
    height: `${p.H}%`,
    backgroundImage: `url(${heroBoard})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
  }
}

export default function HeroShowcase() {
  const [lifted, setLifted] = useState([])
  const [hoverId, setHoverId] = useState(null)
  const stageRef = useRef(null)

  const handleMove = (e) => {
    const el = stageRef.current
    if (!el || window.matchMedia('(max-width: 760px)').matches) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${16 - dy * 16}deg`)
    el.style.setProperty('--ry', `${dx * 18}deg`)
  }

  const handleLeave = () => {
    const el = stageRef.current
    if (!el) return
    el.style.setProperty('--rx', '14deg')
    el.style.setProperty('--ry', '0deg')
  }

  const togglePart = (id) =>
    setLifted((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))

  const toggleAll = () => setLifted(lifted.length === PARTS.length ? [] : PARTS.map((p) => p.id))

  return (
    <div
      className={`hero-photo-stage${lifted.length ? ' lifted' : ''}`}
      ref={stageRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="hero-photo-toggle"
        onClick={toggleAll}
        aria-label={lifted.length === PARTS.length ? 'Assemble board' : 'Dismantle board'}
      >
        {lifted.length === PARTS.length ? 'Assemble All' : 'Dismantle All'}
      </button>

      <div className="hero-photo-orbit" aria-hidden="true" />

      <div className="hero-photo-float">
        <div className="hero-photo-spin">
          <div className="hero-photo-slab">
            <div className="hero-photo-thickness" aria-hidden="true" />
            <div
              className="hero-photo-img"
              style={{ backgroundImage: `url(${heroBoard})` }}
              aria-hidden="true"
            />

            {PARTS.map((p) => (
              <div
                key={p.id}
                className={`hero-photo-part${lifted.includes(p.id) ? ' lifted' : ''}`}
                style={{
                  ...bgFor(p),
                  '--fx': `${p.fx}px`,
                  '--fy': `${p.fy}px`,
                  '--fz': `${p.fz}px`,
                  '--fr': `${p.fr}deg`,
                }}
                onClick={() => togglePart(p.id)}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    togglePart(p.id)
                  }
                }}
              >
                <span className="hero-photo-part-name">{p.name}</span>
              </div>
            ))}

            <div className="hero-photo-shine" aria-hidden="true" />
          </div>
        </div>
      </div>

      <span className="hero-photo-shadow" aria-hidden="true" />

      {DOTS.map((d, i) => (
        <span
          key={i}
          className="hero-photo-dot"
          style={{ left: d.x, top: d.y, animationDelay: d.d }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
