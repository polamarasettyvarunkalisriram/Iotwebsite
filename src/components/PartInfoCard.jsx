import { useEffect } from 'react'
import { X, Check, Minus, Rocket } from 'lucide-react'
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

function Steps({ items }) {
  return (
    <ol className="info-steps">
      {items.map((step, i) => (
        <li key={i}>
          <span className="step-num">{i + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}

export default function PartInfoCard({ part, onClose }) {
  const Icon = iconMap[part?.icon] || Check

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!part) return null

  return (
    <>
      <div className="part-card-backdrop" onClick={onClose} />
      <aside className="part-card" role="dialog" aria-modal="true" aria-label={part.name}>
      <div className="part-card-head">
        <div className="info-icon" style={{ '--part-color': part.color }}>
          <Icon size={24} />
        </div>
        <div className="part-card-title">
          <span className="info-eyebrow">Component</span>
          <h3 className="part-card-name">{part.name}</h3>
        </div>
        <button className="part-card-close" onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>
      </div>

      <div className="part-card-body">
        <section>
          <h4>What is it?</h4>
          <p>{part.what}</p>
        </section>

        {part.howTo && (
          <section>
            <h4>How to Use It</h4>
            <Steps items={part.howTo} />
          </section>
        )}

        <section>
          <h4>Uses</h4>
          <List items={part.uses} icon={Check} tone="cyan" />
        </section>

        <div className="info-cols">
          <section>
            <h4 className="h4-good">Advantages</h4>
            <List items={part.advantages} icon={Check} tone="good" />
          </section>
          <section>
            <h4 className="h4-bad">Disadvantages</h4>
            <List items={part.disadvantages} icon={Minus} tone="bad" />
          </section>
        </div>

        {part.examples && (
          <section>
            <h4>Use Cases</h4>
            <List items={part.examples} icon={Rocket} tone="accent" />
          </section>
        )}
      </div>
      </aside>
    </>
  )
}
