import { useEffect } from 'react'
import { X, Check, Minus, Rocket, HelpCircle } from 'lucide-react'
import { iconMap } from '../data/iconMap.js'

function TinyList({ items, icon: Icon, tone }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="pd-list">
      {items.map((item, i) => (
        <li key={i}>
          <Icon size={12} className={`tone-${tone}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PartDialog({ part, eyebrow, x, y, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!part) return null

  const Icon = iconMap[part.icon] || HelpCircle
  const width = Math.min(320, window.innerWidth - 24)
  const height = Math.min(380, window.innerHeight - 24)

  let left = x + 18
  let top = y + 18
  if (window.innerWidth < 600) {
    left = (window.innerWidth - width) / 2
    top = Math.max(12, (window.innerHeight - height) / 2)
  } else {
    if (left + width > window.innerWidth - 8) left = x - width - 18
    if (top + height > window.innerHeight - 8) top = y - height - 18
    left = Math.max(8, left)
    top = Math.max(8, top)
  }

  return (
    <div className="pd-backdrop" onClick={onClose}>
      <div
        className="part-dialog"
        style={{ left, top, width, maxHeight: height, '--part-color': part.color, '--part-glow': `${part.color}66` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={part.name}
      >
        <div className="pd-head">
          <div className="pd-icon">
            <Icon size={18} />
          </div>
          <div className="pd-title">
            <span className="pd-eyebrow">{eyebrow}</span>
            <h4>{part.name}</h4>
          </div>
          <button className="pd-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {part.short && <p className="pd-short">{part.short}</p>}

        <div className="pd-body">
          <section>
            <h5>
              <Check size={12} /> Uses
            </h5>
            <TinyList items={part.uses} icon={Check} tone="cyan" />
          </section>

          {part.examples && (
            <section>
              <h5>
                <Rocket size={12} /> Use Cases
              </h5>
              <TinyList items={part.examples} icon={Rocket} tone="accent" />
            </section>
          )}

          <div className="pd-cols">
            <section>
              <h5 className="h5-good">Advantages</h5>
              <TinyList items={part.advantages} icon={Check} tone="good" />
            </section>
            <section>
              <h5 className="h5-bad">Disadvantages</h5>
              <TinyList items={part.disadvantages} icon={Minus} tone="bad" />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
