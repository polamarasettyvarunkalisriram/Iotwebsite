import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import AssemblyAnimation from '../components/AssemblyAnimation.jsx'
import ArduinoBoard from '../components/ArduinoBoard.jsx'
import Board3D from '../components/Board3D.jsx'
import ComponentExplorer from '../components/ComponentExplorer.jsx'
import IoTApplications from '../components/IoTApplications.jsx'
import Advantages from '../components/Advantages.jsx'
import ComponentInfo from '../components/ComponentInfo.jsx'
import PartDialog from '../components/PartDialog.jsx'
import ContactSection from '../components/ContactSection.jsx'
import Footer from '../components/Footer.jsx'
import { components } from '../data/arduinoComponents.js'
import { devices } from '../data/devices.js'
import { compareBoards, compareRows } from '../data/compare.js'
import { Check, MousePointerClick } from 'lucide-react'

const realDevices = devices.filter((d) => d.id !== 'arduino')

export default function Home() {
  const [selected, setSelected] = useState(null)
  const [popover, setPopover] = useState(null)

  const openArduino = (part, e) =>
    setPopover({ part, eyebrow: 'Arduino Uno · Part', x: e.clientX, y: e.clientY })

  const openDevice = (device) => (part, e) =>
    setPopover({ part, eyebrow: `${device.full} · Part`, x: e.clientX, y: e.clientY })

  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <AssemblyAnimation onSelect={setSelected} selectedId={selected?.id} />

      <section className="comp-arduino section" id="components">
        <div className="container">
          <div className="section-head center reveal">
            <span className="section-eyebrow">Components</span>
            <h2 className="section-title">
              The <span className="grad">Board</span> Part by Part
            </h2>
            <p className="section-desc">
              Explore the Arduino Uno board part by part — click any part to see its details.
            </p>
          </div>

          <div className="comp-board-card glass reveal">
            <ArduinoBoard onSelect={openArduino} />
            <span className="comp-board-name">Arduino Uno</span>
            <div className="comp-part-chips">
              {components.map((c) => (
                <button key={c.id} className="comp-part-chip" onClick={(e) => openArduino(c, e)}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="comp-board-hint">
              <MousePointerClick size={15} /> Click a part to see its details
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
              Four boards beyond the Arduino — hover to take them apart, click a part, and see what
              they power in real life.
            </p>
          </div>

          <div className="comp-device-grid">
            {realDevices.map((d, i) => (
              <div key={d.id} className={`comp-device-card glass reveal reveal-delay-${i % 2}`}>
                <div className="comp-device-stage">
                  <Board3D device={d} onSelect={openDevice(d)} selectedId={null} />
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

      <ComponentExplorer onSelect={setSelected} />

      <section className="explorer-compare container">
        <span className="section-eyebrow">Side by Side</span>
        <h2 className="explorer-subtitle">Compare the Five Brains</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-corn">Metric</th>
                {compareBoards.map((b) => (
                  <th key={b.id} style={{ '--part-color': b.color }}>
                    <i className="dot" /> {b.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <td className="compare-label">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <IoTApplications />
      <Advantages />
      <ContactSection />
      <Footer />
      <ComponentInfo component={selected} onClose={() => setSelected(null)} />
      <PartDialog
        part={popover?.part}
        eyebrow={popover?.eyebrow}
        x={popover?.x}
        y={popover?.y}
        onClose={() => setPopover(null)}
      />
    </>
  )
}
