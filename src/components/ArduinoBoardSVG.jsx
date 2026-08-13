import { useState } from 'react'
import { components } from '../data/arduinoComponents.js'

const VB = 900
const B = { x: 130, y: 60, w: 640, h: 480 }

const shortNames = {
  microcontroller: 'ATmega328P',
  digital: 'Digital I/O',
  analog: 'Analog Input',
  powerpins: 'Power Pins',
  usb: 'USB Port',
  usbserial: '16U2 Serial',
  dcpower: 'DC Power Jack',
  reset: 'Reset',
  oscillator: '16MHz Crystal',
  regulator: 'Voltage Regulator',
  leds: 'LEDs',
  icsp: 'ICSP Header',
  pwm: 'PWM Pins',
}

const labelSpec = {
  microcontroller: { side: 'right' },
  digital: { side: 'top' },
  analog: { side: 'bottom' },
  powerpins: { side: 'bottom' },
  usb: { side: 'left', dy: 6 },
  usbserial: { side: 'left' },
  dcpower: { side: 'left', dy: -6 },
  reset: { side: 'left', dy: -4 },
  oscillator: { side: 'top', dx: -42 },
  regulator: { side: 'left', dy: 40 },
  leds: { side: 'left' },
  icsp: { side: 'left' },
  pwm: { side: 'right', dy: -42 },
}

const tw = (s) => Math.max(78, Math.min(190, s.length * 6.6 + 48))

const rectOf = (c) => ({
  x: B.x + (c.x / 100) * B.w,
  y: B.y + (c.y / 100) * B.h,
  w: (c.w / 100) * B.w,
  h: (c.h / 100) * B.h,
})

const SILK = {
  fontFamily: "'Space Grotesk','Inter',sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: 2.5,
  fill: 'rgba(63,185,201,0.75)',
}

function PinStrip({ rect, n, pwmPins }) {
  const inner = { x: rect.x + 2, y: rect.y + 2, w: rect.w - 4, h: rect.h - 4 }
  const gap = inner.w / n
  return (
    <g>
      <rect {...inner} fill="#0a0f14" stroke="#2c3d4d" strokeWidth="1.4" rx="4" />
      {Array.from({ length: n }, (_, i) => {
        const x = inner.x + i * gap + gap * 0.24
        return (
          <rect
            key={i}
            x={x}
            y={inner.y + inner.h * 0.18}
            width={gap * 0.52}
            height={inner.h * 0.5}
            rx="1.5"
            fill="url(#gold)"
            stroke="#8f7020"
            strokeWidth="0.8"
          />
        )
      })}
      {pwmPins &&
        pwmPins.map((i) => (
          <text
            key={i}
            x={inner.x + i * gap + gap * 0.42}
            y={inner.y + inner.h * 0.86}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#ff9db0"
          >
            ~
          </text>
        ))}
    </g>
  )
}

function Chip({ rect }) {
  const { x, y, w, h } = rect
  const t = (i) => y + h * 0.12 + i * (h * 0.76) / 14
  return (
    <g>
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}>
          <rect x={x} y={t(i)} width="4.5" height={Math.max(2.5, h * 0.045)} fill="url(#gold)" stroke="#7a5f1c" strokeWidth="0.6" />
          <rect x={x + w - 4.5} y={t(i)} width="4.5" height={Math.max(2.5, h * 0.045)} fill="url(#gold)" stroke="#7a5f1c" strokeWidth="0.6" />
        </g>
      ))}
      <rect x={x + 1.5} y={y + 1.5} width={w - 3} height={h - 3} fill="#0b0f14" stroke="#43586a" strokeWidth="1.4" rx="7" />
      <circle cx={x + 7} cy={y + 9} r="2.6" fill="#123a44" />
      <text x={x + w / 2} y={y + h * 0.42} textAnchor="middle" fontSize={Math.min(13, h * 0.2)} fontWeight="700" fontFamily={SILK.fontFamily} fill="#d5e8f0" letterSpacing="0.5">
        ATMEGA328P
      </text>
      <text x={x + w / 2} y={y + h * 0.64} textAnchor="middle" fontSize={Math.min(9, h * 0.16)} fontWeight="600" letterSpacing="2" fill="#7f98a8">
        8-BIT AVR
      </text>
    </g>
  )
}

function Usb({ rect }) {
  const { x, y, w, h } = rect
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="url(#metal)" stroke="#0d141b" strokeWidth="1.5" />
      <rect x={x + w * 0.12} y={y + h * 0.22} width={w * 0.48} height={h * 0.56} rx="2.5" fill="#060a0e" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + w * 0.15} y={y + h * 0.33} width={w * 0.06} height={h * 0.34} rx="1" fill="url(#gold)" />
      ))}
    </g>
  )
}

function roundBtn({ rect, fill, stroke, label, color }) {
  const cx = rect.x + rect.w / 2
  const cy = rect.y + rect.h / 2
  const r = Math.min(rect.w, rect.h) / 2 - 1
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={Math.min(9, r * 0.62)} fontWeight="700" fontFamily={SILK.fontFamily} fill={color} letterSpacing="0.5">
        {label}
      </text>
    </g>
  )
}

function PartShape({ variant, rect }) {
  switch (variant) {
    case 'microcontroller':
      return <Chip rect={rect} />
    case 'digital':
      return <PinStrip rect={rect} n={14} pwmPins={[3, 5, 6, 9, 10, 11]} />
    case 'analog':
      return <PinStrip rect={rect} n={6} />
    case 'powerpins':
      return <PinStrip rect={rect} n={8} />
    case 'usb':
      return <Usb rect={rect} />
    case 'usbserial':
      return (
        <g>
          <rect {...rect} fill="#0b0f14" stroke="#43586a" strokeWidth="1.3" rx="3" />
          <text x={rect.x + rect.w / 2} y={rect.y + rect.h / 2} textAnchor="middle" dominantBaseline="central" fontSize={Math.min(12, rect.h * 0.6)} fontWeight="700" fontFamily={SILK.fontFamily} fill="#a9c3d4">
            16U2
          </text>
        </g>
      )
    case 'dcpower':
      return (
        <g>
          <circle cx={rect.x + rect.w / 2} cy={rect.y + rect.h / 2} r={Math.min(rect.w, rect.h) / 2} fill="url(#metal)" stroke="#0d141b" strokeWidth="1.5" />
          <circle cx={rect.x + rect.w / 2} cy={rect.y + rect.h / 2} r={Math.min(rect.w, rect.h) * 0.36} fill="#060a0e" />
          <circle cx={rect.x + rect.w / 2} cy={rect.y + rect.h / 2} r={Math.min(rect.w, rect.h) * 0.16} fill="url(#gold)" />
        </g>
      )
    case 'reset':
      return roundBtn({ rect, fill: '#c23a4a', stroke: '#ff6b85', label: 'RST', color: '#fff' })
    case 'oscillator':
      return (
        <g>
          <rect {...rect} rx="5" fill="url(#metal)" stroke="#0d141b" strokeWidth="1.5" />
          <text x={rect.x + rect.w / 2} y={rect.y + rect.h / 2} textAnchor="middle" dominantBaseline="central" fontSize={Math.min(11, rect.h * 0.55)} fontWeight="700" fontFamily={SILK.fontFamily} fill="#1c2833">
            16MHz
          </text>
        </g>
      )
    case 'regulator':
      return (
        <g>
          <rect {...rect} fill="#0b0f14" stroke="#43586a" strokeWidth="1.3" rx="3" />
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={rect.x + rect.w * (0.14 + i * 0.17)} y={rect.y + 3} width="3" height={rect.h - 6} rx="1" fill="#26343f" />
          ))}
          <text x={rect.x + rect.w / 2} y={rect.y + rect.h + 9} textAnchor="middle" fontSize={Math.min(9, rect.h * 0.5)} fontWeight="700" fontFamily={SILK.fontFamily} fill="#a9c3d4" letterSpacing="1">
            LDO 5V
          </text>
        </g>
      )
    case 'leds':
      return (
        <g>
          <rect {...rect} fill="#070c11" stroke="#1e303e" strokeWidth="1.2" rx="5" />
          {[
            { dx: 0.22, c: '#f0c53c' },
            { dx: 0.5, c: '#f0c53c' },
            { dx: 0.78, c: '#2fdf6e' },
          ].map((d, i) => (
            <circle key={i} cx={rect.x + rect.w * d.dx} cy={rect.y + rect.h * 0.5} r={Math.min(rect.h, rect.w) * 0.16} fill={d.c} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          ))}
        </g>
      )
    case 'icsp':
      return (
        <g>
          <rect {...rect} fill="#0b0f14" stroke="#43586a" strokeWidth="1.3" rx="4" />
          {Array.from({ length: 6 }, (_, i) => {
            const col = i % 2
            const row = Math.floor(i / 2)
            return (
              <rect
                key={i}
                x={rect.x + 4 + col * (rect.w - 10) / 2}
                y={rect.y + 4 + row * (rect.h - 10) / 3}
                width={(rect.w - 10) / 2 - 2}
                height={(rect.h - 10) / 3 - 2}
                rx="1.5"
                fill="url(#gold)"
                stroke="#7a5f1c"
                strokeWidth="0.6"
              />
            )
          })}
        </g>
      )
    case 'pwm':
      return (
        <g>
          <rect {...rect} rx="6" fill="rgba(230,50,80,0.12)" stroke="rgba(230,50,80,0.55)" strokeWidth="1.4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={rect.x + 3 + i * (rect.w - 6) / 6}
              y={rect.y + rect.h * 0.18}
              width={(rect.w - 6) / 6 - 3}
              height={rect.h * 0.4}
              rx="2"
              fill="url(#gold)"
              stroke="#8f7020"
              strokeWidth="0.8"
            />
          ))}
          <text x={rect.x + rect.w / 2} y={rect.y + rect.h * 0.72} textAnchor="middle" fontSize={Math.min(10, rect.w * 0.28)} fontWeight="700" fontFamily={SILK.fontFamily} fill="#ff9db0">
            PWM
          </text>
        </g>
      )
    default:
      return null
  }
}

function Label({ comp, rect }) {
  const spec = labelSpec[comp.id] || { side: 'left' }
  const name = shortNames[comp.id] || comp.name
  const w = tw(name)
  const H = 28
  const cy = rect.y + rect.h / 2 + (spec.dy || 0)
  const cx = rect.x + rect.w / 2 + (spec.dx || 0)

  let px, py, x1, y1, x2, y2
  if (spec.side === 'right') {
    px = VB - 10 - w
    py = cy - H / 2
    x1 = rect.x + rect.w
    y1 = cy
    x2 = px
    y2 = cy
  } else if (spec.side === 'top') {
    px = cx - w / 2
    py = 10
    x1 = cx
    y1 = rect.y
    x2 = cx
    y2 = py + H + 5
  } else if (spec.side === 'bottom') {
    px = cx - w / 2
    py = VB - 10 - H
    x1 = cx
    y1 = rect.y + rect.h
    x2 = cx
    y2 = py - 5
  } else {
    px = 10
    py = cy - H / 2
    x1 = rect.x
    y1 = cy
    x2 = px + w
    y2 = cy
  }
  px = Math.max(6, Math.min(VB - 6 - w, px))
  py = Math.max(6, Math.min(VB - 6 - H, py))

  return (
    <g className="bp-label">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(150,195,212,0.55)" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform={`translate(${px}, ${py})`}>
        <rect width={w} height={H} rx={H / 2} fill="#f6fbff" stroke={comp.color} strokeWidth="1.6" filter="url(#labelShadow)" />
        <circle cx="17" cy={H / 2} r="4.5" fill={comp.color} />
        <text x="30" y={H / 2 + 0.5} dominantBaseline="central" fontFamily={SILK.fontFamily} fontWeight="700" fontSize="12.5" fill="#0b2128">
          {name}
        </text>
      </g>
    </g>
  )
}

function Part({ comp, rect, selected, onSelect, onHover }) {
  return (
    <g
      className={`bp-zone${selected ? ' sel' : ''}`}
      onMouseEnter={() => onHover(comp.id)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect && onSelect(comp)
      }}
      style={{ color: comp.color, filter: selected ? `drop-shadow(0 0 7px ${comp.color})` : undefined }}
    >
      <PartShape variant={comp.variant} rect={rect} />
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="6" fill="transparent" stroke={comp.color} strokeWidth={selected ? 2 : 0} strokeOpacity="0.9" pointerEvents="none" />
      <Label comp={comp} rect={rect} />
    </g>
  )
}

function Silks() {
  return (
    <g style={SILK}>
      <text transform={`rotate(-90 ${B.x + 24} ${B.y + 130})`} x={B.x + 24} y={B.y + 130} textAnchor="middle" fontSize="15">
        ARDUINO
      </text>
      <text x={B.x + 28} y={B.y + 230} fontSize="11" letterSpacing="3" fill="rgba(63,185,201,0.5)">
        UNO
      </text>
      <text x={B.x + B.w * 0.105} y={B.y + B.h * 0.5 + 14} fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        ICSP
      </text>
      <text x={B.x + B.w * 0.24} y={B.y + B.h * 0.56} fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        TX·RX·L
      </text>
      <text x={B.x + B.w * 0.205} y={B.y + B.h * 0.245} fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        PWR
      </text>
      <text x={B.x + B.w * 0.565} y={B.y + B.h * 0.955} textAnchor="middle" fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        ANALOG IN
      </text>
      <text x={B.x + B.w * 0.84} y={B.y + B.h * 0.955} textAnchor="middle" fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        POWER
      </text>
      <text x={B.x + B.w * 0.075} y={B.y + B.h * 0.075} fontSize="9.5" letterSpacing="2" fill="rgba(63,185,201,0.45)">
        RESET
      </text>
    </g>
  )
}

export default function ArduinoBoardSVG({ onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null)

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className={`arduino-svg${selectedId ? ' has-selected' : ''}`}
      role="img"
      aria-label="Arduino Uno board with named parts"
    >
      <defs>
        <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12363c" />
          <stop offset="55%" stopColor="#0b232b" />
          <stop offset="100%" stopColor="#071820" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="55%" stopColor="#d9b44a" />
          <stop offset="100%" stopColor="#a8832a" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdd8e0" />
          <stop offset="60%" stopColor="#7b8c9a" />
          <stop offset="100%" stopColor="#4c5f6d" />
        </linearGradient>
        <filter id="labelShadow" x="-25%" y="-40%" width="170%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#04121a" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x={B.x} y={B.y} width={B.w} height={B.h} rx="18" fill="url(#pcb)" stroke="rgba(53,224,255,0.35)" strokeWidth="2" />
      <rect x={B.x + 6} y={B.y + 6} width={B.w - 12} height={B.h - 12} rx="13" fill="none" stroke="rgba(53,224,255,0.08)" strokeWidth="1" />

      {[
        { cx: B.x + 30, cy: B.y + 30 },
        { cx: B.x + B.w - 30, cy: B.y + 30 },
        { cx: B.x + 30, cy: B.y + B.h - 30 },
        { cx: B.x + B.w - 30, cy: B.y + B.h - 30 },
      ].map((h, i) => (
        <g key={i}>
          <circle cx={h.cx} cy={h.cy} r="15" fill="#05090c" stroke="rgba(53,224,255,0.5)" strokeWidth="3" />
          <circle cx={h.cx} cy={h.cy} r="6" fill="#0e1f26" />
        </g>
      ))}

      <Silks />

      {components.map((comp) => (
        <Part
          key={comp.id}
          comp={comp}
          rect={rectOf(comp)}
          selected={comp.id === selectedId}
          onSelect={onSelect}
          onHover={setHovered}
        />
      ))}

      <text x="16" y={VB - 14} fontSize="12" fontFamily={SILK.fontFamily} fontWeight="600" fill="rgba(150,195,212,0.5)">
        {hovered
          ? (shortNames[hovered] || '') + ' — click for full details'
          : 'Hover a part · click to learn more'}
      </text>
    </svg>
  )
}
