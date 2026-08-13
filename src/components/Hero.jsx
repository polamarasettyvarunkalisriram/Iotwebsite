import { useState } from 'react'
import { devices } from '../data/devices.js'
import DeviceCarousel from './DeviceCarousel.jsx'
import { Cpu } from 'lucide-react'

export default function Hero() {
  const [active, setActive] = useState(0)
  const device = devices[active]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-board">
          <DeviceCarousel active={active} onActive={setActive} />
        </div>
      </section>

      <section className="hero-intro">
        <div className="container hero-center">
          <span className="section-eyebrow">Interactive Learning</span>
          <h1 className="hero-title">
            Explore the <span className="grad">Brains of IoT</span>
          </h1>
          <p className="hero-sub">
            Meet the three devices that power the Internet of Things — a microcontroller, a
            single-board computer and a wireless chip. Click any part to take it apart and learn
            how it works.
          </p>

          <div className="hero-actions">
            <button className="btn btn-ghost" onClick={() => scrollTo('components')}>
              <Cpu size={18} /> Learn Components
            </button>
          </div>

          <div className="hero-stats">
            {device.stats.map(([v, l]) => (
              <div className="stat" key={l}>
                <span className="stat-value">{v}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
