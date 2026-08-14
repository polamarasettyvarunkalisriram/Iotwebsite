import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import BoardDetails, { pcbColorFor } from './BoardDetails.jsx'

export const BOARD_W = 10
export const BOARD_H = 7

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export function partToWorld(part) {
  const cx = part.x + part.w / 2
  const cy = part.y + part.h / 2
  return {
    x: ((cx - 50) / 100) * BOARD_W,
    y: -((cy - 50) / 100) * BOARD_H,
    w: (part.w / 100) * BOARD_W,
    h: (part.h / 100) * BOARD_H,
  }
}

export default function Module3D({ part, index, phase, dimmed, hovered, selected, onHover, onSelect }) {
  const group = useRef(null)
  const slabMat = useRef(null)
  const ringMat = useRef(null)
  const anim = useRef({ start: null, p: 0, shown: false })
  const hoverAmt = useRef(0)
  const { x, y, w, h } = partToWorld(part)
  const [showLabel, setShowLabel] = useState(false)

  useEffect(() => {
    anim.current.start = null
  }, [phase])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const clock = state.clock.elapsedTime
    if (anim.current.start === null) anim.current.start = clock
    const raw = (clock - anim.current.start - index * 0.15) / 0.7
    const p = easeInOutCubic(clamp01(raw))
    anim.current.p = p
    const eff = phase === 1 ? p : 1 - p

    const target = hovered || selected ? 1 : 0
    hoverAmt.current += (target - hoverAmt.current) * Math.min(1, delta * 9)
    const ha = hoverAmt.current

    const ox = (part.offX || 0) * 0.05
    const oy = -(part.offY || 0) * 0.05
    const len = Math.hypot(x, y) || 1
    g.position.x = x + ox * eff + (x / len) * 0.55 * ha
    g.position.y = y + oy * eff + (y / len) * 0.55 * ha
    g.position.z = 0.06 + eff * 1.4 + 0.95 * ha
    g.rotation.z = ha * 0.04

    const s = 1 + ha * 0.05
    g.scale.setScalar(s)

    if (slabMat.current) {
      slabMat.current.emissiveIntensity = selected ? 0.5 : hovered ? 0.3 : 0.05
      slabMat.current.opacity = dimmed && !hovered ? 0.45 : 1
    }
    if (ringMat.current) {
      ringMat.current.opacity = ha > 0.01 ? 0.8 : 0
    }

    const lbl = phase === 1 && p > 0.5
    if (lbl !== anim.current.shown) {
      anim.current.shown = lbl
      setShowLabel(lbl)
    }
  })

  const labelY = part.labelPos === 'top' ? h / 2 + 0.4 : -h / 2 - 0.4

  return (
    <group
      ref={group}
      position={[x, y, 0.06]}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover?.(part.id)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'auto'
        onHover?.(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(part.id)
      }}
    >
      <mesh position={[0, 0, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w * 0.58, w * 0.72, 48]} />
        <meshBasicMaterial
          ref={ringMat}
          color={part.color}
          transparent
          opacity={0}
          depthWrite={false}
          blending={2}
        />
      </mesh>

      <RoundedBox args={[w, h, 0.08]} radius={0.06} smoothness={2} position={[0, 0, 0.04]}>
        <meshStandardMaterial
          ref={slabMat}
          color={pcbColorFor(part.id)}
          emissive={part.color}
          emissiveIntensity={0.05}
          metalness={0.3}
          roughness={0.6}
          transparent
        />
      </RoundedBox>

      <RoundedBox args={[w, h, 0.012]} radius={0.05} smoothness={2} position={[0, 0, 0.084]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.06} roughness={0.9} />
      </RoundedBox>

      <BoardDetails part={part} w={w} h={h} />

      {showLabel && (
        <Html position={[0, labelY, 0.3]} center distanceFactor={14} occlude={false} zIndexRange={[40, 0]}>
          <div className="board3d-label" style={{ '--part-color': part.color }}>
            {part.name}
          </div>
        </Html>
      )}

      {hovered && !selected && (
        <Html position={[0, -h / 2 - 0.85, 0.3]} center distanceFactor={14} zIndexRange={[50, 10]}>
          <div className="board3d-tip">
            <b style={{ color: part.color }}>{part.name}</b>
            <span>{part.short}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
