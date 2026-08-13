import { components } from '../data/arduinoComponents.js'

function PinStrip({ n }) {
  return (
    <div className="pin-strip">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="pin" />
      ))}
    </div>
  )
}

function PartVisual({ variant }) {
  switch (variant) {
    case 'microcontroller':
      return (
        <div className="part-chip">
          <span className="chip-text">ATMEGA328P</span>
          <span className="chip-sub">8-BIT AVR</span>
        </div>
      )
    case 'digital':
      return <PinStrip n={14} />
    case 'analog':
      return <PinStrip n={6} />
    case 'powerpins':
      return <PinStrip n={8} />
    case 'usb':
      return (
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
    case 'dcpower':
      return (
        <div className="part-powerjack">
          <span className="powerjack-hole" />
        </div>
      )
    case 'reset':
      return (
        <div className="part-reset">
          <span>RST</span>
        </div>
      )
    case 'oscillator':
      return (
        <div className="part-osc">
          <span>16MHz</span>
        </div>
      )
    case 'regulator':
      return (
        <div className="part-reg">
          <span>LDO 5V</span>
        </div>
      )
    case 'leds':
      return (
        <div className="part-leds">
          <span className="led-dot green" />
          <span className="led-dot yellow" />
          <span className="led-dot red" />
        </div>
      )
    case 'icsp':
      return (
        <div className="part-icsp">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
    case 'usbserial':
      return (
        <div className="part-serial">
          <span>16U2</span>
        </div>
      )
    default:
      return null
  }
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
      <PartVisual variant={comp.variant} />
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

export default function ArduinoBoard({
  parts = components,
  onSelect,
  selectedId,
  transformFor,
  labelVisible,
  smooth = true,
  flat = false,
}) {
  const labelsForced = typeof labelVisible === 'boolean' && labelVisible

  return (
    <div
      className={`arduino-board board ${smooth ? 'smooth' : 'fast'} ${flat ? 'board-flat' : ''} ${
        selectedId ? 'dimmed' : ''
      } ${labelsForced ? 'labels-visible' : ''}`}
    >
      <span className="silk silk-ar">ARDUINO</span>
      <span className="silk silk-uno">UNO · IoT</span>
      <span className="silk silk-u digital">DIGITAL (PWM~)</span>
      <span className="silk silk-u analog">ANALOG IN</span>
      <span className="silk silk-u power">POWER</span>
      <span className="silk silk-u icsp">ICSP</span>
      <span className="silk silk-u usb">USB</span>

      {parts.map((comp, i) => {
        const t = transformFor ? transformFor(comp, i) : { transform: undefined, opacity: 1 }
        const lv = labelVisible
          ? typeof labelVisible === 'boolean'
            ? labelVisible
            : labelVisible(comp, i)
          : false
        return (
          <BoardPart
            key={comp.id}
            comp={comp}
            index={i}
            selected={comp.id === selectedId}
            onSelect={onSelect}
            transformStyle={t}
            labelVisible={lv}
          />
        )
      })}
    </div>
  )
}
