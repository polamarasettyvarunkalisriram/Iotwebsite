import { iotboard } from '../data/devices.js'
import ExplodedBoard3D from './ExplodedBoard3D.jsx'
import { Cpu } from 'lucide-react'

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-board">
          <h2 className="hero-board-title">Multi MCU IoT Development Board</h2>
          <ExplodedBoard3D />
        </div>
      </section>

      <section className="hero-intro">
        <div className="container hero-center">
          <span className="section-eyebrow">Interactive Learning</span>
          <h1 className="hero-title">
            Explore the <span className="grad">Brains of IoT</span>
          </h1>
          <p className="hero-sub">
            A single IoT development board that powers the Internet of Things — sense, think and
            connect with every project you build.
          </p>

          <div className="hero-actions">
            <button className="btn btn-ghost" onClick={() => scrollTo('components')}>
              <Cpu size={18} /> Learn Components
            </button>
          </div>

          <div className="hero-stats">
            {iotboard.stats.map(([v, l]) => (
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
