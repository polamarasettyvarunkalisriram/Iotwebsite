import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ArduinoBoard from '../components/ArduinoBoard.jsx'
import Board3D from '../components/Board3D.jsx'
import ComponentInfo from '../components/ComponentInfo.jsx'
import PartInfoCard from '../components/PartInfoCard.jsx'
import { components } from '../data/arduinoComponents.js'
import { devices } from '../data/devices.js'
import { Check, MousePointerClick } from 'lucide-react'

const realDevices = devices.filter((d) => d.id !== 'arduino')

export default function Components() {
  const [selectedPart, setSelectedPart] = useState(null)
  const [selectedDevicePart, setSelectedDevicePart] = useState(null)

  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Components</span>
          <h1 className="page-title">
            The <span className="grad">Board</span> &amp; Beyond
          </h1>
          <p className="page-sub">
            Explore the Arduino Uno board part by part, then see how four more IoT
            devices are really used in the world around you.
          </p>
        </div>
      </section>

      <section className="comp-arduino section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="section-eyebrow">Arduino Uno</span>
            <h2 className="section-title">
              Anatomy of the <span className="grad">Arduino Board</span>
            </h2>
            <p className="section-desc">
              Click any part of the board — or a chip below — to open its details.
            </p>
          </div>

          <div className="comp-board-card glass reveal">
            <ArduinoBoard onSelect={setSelectedPart} />
            <span className="comp-board-name">Arduino Uno</span>
            <div className="comp-part-chips">
              {components.map((c) => (
                <button
                  key={c.id}
                  className="comp-part-chip"
                  onClick={() => setSelectedPart(c)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="comp-board-hint">
              <MousePointerClick size={15} /> Click a part to explore it
            </div>
          </div>
        </div>
      </section>

      <section className="comp-devices section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="section-eyebrow">Real-World Usage</span>
            <h2 className="section-title">
              How IoT Devices Are <span className="grad">Used Today</span>
            </h2>
            <p className="section-desc">
              Four boards beyond the Arduino — hover to take them apart, click a part,
              and see what they power in real life.
            </p>
          </div>

          <div className="comp-device-grid">
            {realDevices.map((d, i) => (
              <div key={d.id} className={`comp-device-card glass reveal reveal-delay-${i % 2}`}>
                <div className="comp-device-stage">
                  <Board3D
                    device={d}
                    onSelect={setSelectedDevicePart}
                    selectedId={selectedDevicePart?.id}
                  />
                </div>
                <div className="comp-device-body">
                  <div className="comp-device-head">
                    <h3>{d.full}</h3>
                    <span className="comp-device-tag">{d.tag}</span>
                  </div>
                  <p className="comp-device-real">{d.real}</p>
                  <ul className="comp-device-list">
                    {d.realWorld.map((u, j) => (
                      <li key={j}>
                        <Check size={13} />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="comp-device-stats">
                    {d.stats.map(([v, l], j) => (
                      <span key={j} className="comp-stat">
                        <b>{v}</b>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <ComponentInfo component={selectedPart} onClose={() => setSelectedPart(null)} />
      {selectedDevicePart && (
        <PartInfoCard part={selectedDevicePart} onClose={() => setSelectedDevicePart(null)} />
      )}
    </>
  )
}
