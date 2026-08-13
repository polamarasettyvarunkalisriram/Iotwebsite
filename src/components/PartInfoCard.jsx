import { useEffect } from 'react'
import { X, Check, Minus, Rocket, HelpCircle } from 'lucide-react'
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

export default function PartInfoCard({ part, onClose }) {
  const Icon = iconMap[part?.icon] || HelpCircle

  useEffect(() => {
    if (!part) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [part, onClose])

  if (!part) return null

  return (
    <div className="part-card-backdrop" onClick={onClose}>
      <div
        className="part-card"
        role="dialog"
        aria-modal="true"
        aria-label={part.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="part-card-close" onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>

        <div className="part-card-head">
          <div className="info-icon" style={{ '--part-color': part.color }}>
            <Icon size={24} />
          </div>
          <div className="part-card-title">
            <span className="info-eyebrow">Component Details</span>
            <h3 className="part-card-name">{part.name}</h3>
          </div>
        </div>

        <div className="part-card-body">
          <section className="pc-what">
            <h4>
              <HelpCircle size={14} /> What is it?
            </h4>
            <p>{part.what}</p>
          </section>

          <section>
            <h4>
              <Check size={14} /> Uses
            </h4>
            <List items={part.uses} icon={Check} tone="cyan" />
          </section>

          <div className="info-cols">
            <section>
              <h4 className="h4-good">
                <Check size={14} /> Advantages
              </h4>
              <List items={part.advantages} icon={Check} tone="good" />
            </section>
            <section>
              <h4 className="h4-bad">
                <Minus size={14} /> Disadvantages
              </h4>
              <List items={part.disadvantages} icon={Minus} tone="bad" />
            </section>
          </div>

          {part.examples && (
            <section className="pc-examples">
              <h4>
                <Rocket size={14} /> Example Use Cases
              </h4>
              <List items={part.examples} icon={Rocket} tone="accent" />
            </section>
          )}
        </div>

        <button className="btn btn-primary pc-done" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}
