import { components } from '../data/arduinoComponents.js'
import { iconMap } from '../data/iconMap.js'
import { ArrowRight, Lightbulb } from 'lucide-react'

export default function ComponentExplorer({ onSelect }) {
  return (
    <section id="components" className="section explorer-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">Anatomy of the Board</span>
          <h2 className="section-title">
            Explore <span className="grad">IoT Components</span>
          </h2>
          <p className="section-desc">
            Every part of a connected board has a role to play. Click any card to open a detailed
            breakdown — or click the parts directly on the 3D board.
          </p>
        </div>

        <div className="explorer-grid">
          {components.map((c, i) => {
            const Icon = iconMap[c.icon] || Lightbulb
            return (
              <div
                key={c.id}
                className={`explorer-card glass reveal reveal-delay-${i % 4}`}
                style={{ '--part-color': c.color }}
                onClick={() => onSelect(c)}
              >
                <div className="explorer-icon">
                  <Icon size={22} />
                </div>
                <div className="explorer-body">
                  <h3>{c.name}</h3>
                  <p>{c.short}</p>
                  <button className="explorer-btn" onClick={() => onSelect(c)}>
                    Explore <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
