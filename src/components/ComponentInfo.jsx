import { useEffect } from 'react'
import { X, Check, Minus, Lightbulb } from 'lucide-react'
import { iconMap } from '../data/iconMap.js'

function List({ items, icon: Icon, tone }) {
  return (
    <ul className="info-list">
      {items.map((item, i) => (
        <li key={i}>
          <Icon size={14} className={`tone-${tone}`} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function ComponentInfo({ component, onClose }) {
  useEffect(() => {
    if (!component) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [component, onClose])

  if (!component) return null
  const Icon = iconMap[component.icon] || Lightbulb

  return (
    <div className="info-overlay" onClick={onClose}>
      <div
        className={`info-panel glass ${component.id}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="info-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="info-head">
          <div className="info-icon" style={{ '--part-color': component.color }}>
            <Icon size={26} />
          </div>
          <div>
            <span className="info-eyebrow">Component</span>
            <h3 className="info-name">{component.name}</h3>
          </div>
        </div>

        <div className="info-body">
          <section>
            <h4>What is it?</h4>
            <p>{component.what}</p>
          </section>

          <section>
            <h4>Uses</h4>
            <List items={component.uses} icon={Check} tone="cyan" />
          </section>

          <div className="info-cols">
            <section>
              <h4 className="h4-good">Advantages</h4>
              <List items={component.advantages} icon={Check} tone="good" />
            </section>
            <section>
              <h4 className="h4-bad">Disadvantages</h4>
              <List items={component.disadvantages} icon={Minus} tone="bad" />
            </section>
          </div>

          <section className="info-example">
            <h4>Example Use Cases</h4>
            {component.examples.map((ex, i) => (
              <p key={i}>• {ex}</p>
            ))}
          </section>
        </div>

        <button className="btn btn-primary info-done" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
