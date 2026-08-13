import { useEffect, useRef, useState } from 'react'
import { components, assemblyStages } from '../data/arduinoComponents.js'
import ArduinoBoard from './ArduinoBoard.jsx'
import { Rocket, MousePointerClick } from 'lucide-react'

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const STAGE_PART_LABELS = {
  microcontroller: 'ATmega328P',
  digital: 'Digital Pins',
  analog: 'Analog Pins',
  pwm: 'PWM Pins',
  powerpins: 'Power Pins',
  usb: 'USB Port',
  usbserial: 'USB-to-Serial',
  dcpower: 'DC Power Jack',
  reset: 'Reset Button',
  oscillator: 'Oscillator',
  regulator: 'Regulator',
  leds: 'LEDs',
  icsp: 'ICSP',
}

export default function AssemblyAnimation({ onSelect, selectedId }) {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const total = rect.height
        let p = -rect.top / total
        p = Math.min(1, Math.max(0, p))
        setProgress(p)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const N = assemblyStages.length
  const stageIndex = Math.min(N - 1, Math.floor(progress * N))
  const stage = assemblyStages[stageIndex]
  const stageParts = components.filter((c) => c.stage === stageIndex + 1)

  const pcbT = ease(Math.min(1, Math.max(0, progress * N)))

  const transformFor = (comp) => {
    const s = (comp.stage - 1) / N
    const e = comp.stage / N
    const t = ease(Math.min(1, Math.max(0, (progress - s) / (e - s))))
    const dx = comp.offX * 2.6 * (1 - t)
    const dy = comp.offY * 2.6 * (1 - t)
    return {
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${0.5 + 0.5 * t})`,
      opacity: Math.min(1, t * 1.5),
      labelOn: comp.stage === stageIndex + 1 && t > 0.4,
    }
  }

  const finalShow = progress > 0.92
  const stageShow = !finalShow && progress < 0.995

  return (
    <section id="assembly" className="assembly" ref={sectionRef}>
      <div className="assembly-sticky">
        <div className="assembly-head">
          <span className="section-eyebrow">Scroll to Build</span>
          <h2 className="section-title">
            How a Board <span className="grad">Comes Together</span>
          </h2>
          <p className="section-desc">Keep scrolling — the board assembles itself, stage by stage.</p>
        </div>

        {stageShow && (
          <>
            <div className="stage-badge">
              <span className="stage-count">
                Stage {stageIndex + 1} of {N}
              </span>
              <span className="stage-title">{stage.title}</span>
            </div>
            <p className="stage-desc">{stage.desc}</p>

            {stageParts.length > 0 && (
              <>
                <div className="stage-parts">
                  {stageParts.map((p) => (
                    <button
                      className={`stage-part${p.id === selectedId ? ' active' : ''}`}
                      key={p.id}
                      onClick={() => onSelect(p)}
                    >
                      <span className="stage-part-dot" style={{ '--part-color': p.color }} />
                      {STAGE_PART_LABELS[p.id] || p.name}
                    </button>
                  ))}
                </div>
                <p className="stage-hint">Click a part to see its uses, advantages and disadvantages.</p>
              </>
            )}
          </>
        )}

        <div className="stage-progress" aria-hidden="true">
          {assemblyStages.map((s, i) => (
            <span key={s.title} className={`seg${i <= stageIndex ? ' on' : ''}`} />
          ))}
        </div>

        <div
          className="assembly-board-wrap"
          style={{
            opacity: pcbT,
            transform: `perspective(1100px) rotateX(30deg) scale(${0.82 + 0.18 * pcbT})`,
          }}
        >
          <ArduinoBoard
            selectedId={selectedId}
            onSelect={onSelect}
            transformFor={transformFor}
            labelVisible={(comp) => transformFor(comp).labelOn}
            smooth={false}
            flat
          />
        </div>

        <div className={`assembly-final${finalShow ? ' show' : ''}`}>
          <div className="final-card glass">
            <div className="final-icon">
              <Rocket size={30} />
            </div>
            <h3>
              A Board <span className="grad">Ready for IoT</span>
            </h3>
            <p>
              Every component is in place. From a handful of parts, a powerful IoT device is
              born — ready to sense, think and act.
            </p>
            <div className="scene-hint" style={{ marginTop: 18 }}>
              <MousePointerClick size={16} /> Scroll back to watch it come apart again
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
