import { useRef } from 'react'

function PinStrip({ n }) {
  return (
    <div className="pin-strip">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="pin" />
      ))}
    </div>
  )
}

function PartVisual({ part }) {
  const k = part.kind
  let inner
  switch (k) {
    case 'chip':
      inner = (
        <>
          <span className="chip-text">{part.chipText || 'CHIP'}</span>
          <span className="chip-sub">{part.chipSub || ''}</span>
        </>
      )
      break
    case 'pins':
      inner = <PinStrip n={part.n || 8} />
      break
    case 'usb':
      inner = (
        <div className="part-usb">
          <span className="usb-slot" />
          <span className="usb-pins">
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>
      )
      break
    case 'usbc':
      inner = (
        <div className="part-usbc">
          <span />
        </div>
      )
      break
    case 'usba':
      inner = (
        <div className="part-usba">
          <span />
          <span />
        </div>
      )
      break
    case 'eth':
      inner = (
        <div className="part-eth">
          <span />
        </div>
      )
      break
    case 'hdmi':
      inner = (
        <div className="part-hdmi">
          <span />
          <span />
        </div>
      )
      break
    case 'sd':
      inner = (
        <div className="part-sd">
          <span />
        </div>
      )
      break
    case 'csi':
    case 'dsi':
      inner = <div className="part-csi" />
      break
    case 'jack':
      inner = (
        <div className="part-powerjack">
          <span className="powerjack-hole" />
        </div>
      )
      break
    case 'button':
      inner = (
        <div className="part-reset">
          <span>{part.label || 'RST'}</span>
        </div>
      )
      break
    case 'can':
      inner = (
        <div className="part-osc">
          <span>{part.chipText || '16MHz'}</span>
        </div>
      )
      break
    case 'regulator':
      inner = (
        <div className="part-reg">
          <span>{part.chipText || 'LDO 5V'}</span>
        </div>
      )
      break
    case 'led': {
      const colors = ['green', 'yellow', 'red']
      inner = (
        <div className="part-leds">
          {Array.from({ length: part.n || 3 }, (_, i) => (
            <span key={i} className={`led-dot ${colors[i % colors.length]}`} />
          ))}
        </div>
      )
      break
    }
    case 'icsp':
      inner = (
        <div className="part-icsp">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
      break
    case 'module':
      inner = (
        <div className="part-module">
          <span className="chip-text">{part.chipText || 'MODULE'}</span>
          <span className="chip-sub">{part.chipSub || ''}</span>
        </div>
      )
      break
    case 'wifi':
      inner = (
        <div className="part-wifi">
          <span className="chip-text">Wi-Fi</span>
          <span className="chip-sub">2.4G · BT</span>
        </div>
      )
      break
    case 'antenna':
      inner = <div className="part-antenna" />
      break
    default:
      inner = <div className="part-chip"><span className="chip-text">PART</span></div>
  }

  return <div className={`part-visual kind-${k}`}>{inner}</div>
}

function BoardPart({ comp, index, selected, onSelect, transformStyle, labelVisible }) {
  const glow = `${comp.color}66`
  return (
    <div
      className={`board-part${selected ? ' selected' : ''}${labelVisible ? ' label-visible' : ''}`}
      style={{
        left: `${comp.x}%`,
        top: `${comp.y}%`,
        width: `${comp.w}%`,
        height: `${comp.h}%`,
        '--part-color': comp.color,
        '--part-glow': glow,
        '--label-delay': transformStyle.delay || '0ms',
        transform: transformStyle.transform,
        opacity: transformStyle.opacity,
        transitionDelay: transformStyle.delay,
        zIndex: selected ? 40 : 5,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect && onSelect(comp, e)
      }}
    >
      <PartVisual part={comp} />
      <span className="part-dot" />
      <span className={`part-label pos-${comp.labelPos}`}>
        <span className="part-label-inner">
          <span className="dot" />
          {comp.name}
        </span>
      </span>
    </div>
  )
}

export default function Board3D({ device, disassembled, onSelect, selectedId }) {
  const sceneRef = useRef(null)

  const handleMove = (e) => {
    const el = sceneRef.current
    if (!el || window.matchMedia('(max-width: 768px)').matches) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${24 - dy * 16}deg`)
    el.style.setProperty('--ry', `${dx * 18}deg`)
  }

  const handleLeave = () => {
    const el = sceneRef.current
    if (!el) return
    el.style.setProperty('--rx', '24deg')
    el.style.setProperty('--ry', '0deg')
  }

  const transformFor = (comp, i) => ({
    transform: disassembled
      ? `translate3d(calc(${comp.offX}px * var(--scatter, 1)), calc(${comp.offY}px * var(--scatter, 1)), 0) scale(1.06)`
      : 'translate3d(0,0,0)',
    opacity: 1,
    delay: disassembled ? `${i * 70}ms` : '0ms',
  })

  return (
    <div
      className={`board-scene ${device.aspect}${selectedId ? ' selected-part' : ''}`}
      ref={sceneRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="board-sway">
        <div className="board-3d">
          <div
            className={`arduino-board board smooth ${device.pcb}${
              disassembled ? ' labels-visible' : ''
            }${selectedId ? ' dimmed' : ''}`}
          >
            {device.silks.map((s, i) => (
              <span
                key={i}
                className="silk dev-silk"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  fontSize: s.s,
                  letterSpacing: s.ls || 1.5,
                  color: device.silkColor,
                  transform: s.a ? `rotate(${s.a}deg) translate(-50%, -50%)` : 'translate(-50%, -50%)',
                }}
              >
                {s.t}
              </span>
            ))}

            {device.parts.map((comp, i) => (
              <BoardPart
                key={comp.id}
                comp={comp}
                index={i}
                selected={comp.id === selectedId}
                onSelect={onSelect}
                transformStyle={transformFor(comp, i)}
                labelVisible={disassembled}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
