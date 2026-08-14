import { RoundedBox } from '@react-three/drei'

export const GOLD = '#c9a84c'
export const SILVER = '#c9ccd2'
export const BLACK = '#131a21'
export const PLASTIC = '#1b232b'
export const RED = '#ff3b30'
export const GREEN = '#3ddc84'
export const YELLOW = '#ffcc00'
export const WHITE = '#e8ecef'

export function pcbColorFor(id) {
  switch (id) {
    case 'arduino':
      return '#00a19c'
    case 'raspberry-pi':
      return '#0b5c35'
    case 'esp32':
      return '#101016'
    case 'stm32':
      return '#154a9c'
    case 'beaglebone':
      return '#0a5a30'
    default:
      return '#0d3b2e'
  }
}

/* ---------- reusable pieces ---------- */

function Chip({ x, y, w, h, metal = false, silver = false }) {
  return (
    <group position={[x, y, 0.105]}>
      <mesh>
        <boxGeometry args={[w, h, 0.05]} />
        <meshStandardMaterial color={metal ? '#1a2026' : BLACK} metalness={0.55} roughness={0.45} />
      </mesh>
      {silver && (
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[w * 0.8, h * 0.7, 0.012]} />
          <meshStandardMaterial color={SILVER} metalness={0.95} roughness={0.25} />
        </mesh>
      )}
      {!silver && (
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[w * 0.55, h * 0.16, 0.006]} />
          <meshStandardMaterial color="#2a333d" metalness={0.4} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

function PinRow({ x0, y, dx, n, len = 0.11 }) {
  const pins = []
  for (let i = 0; i < n; i++) {
    pins.push(
      <mesh key={i} position={[i * dx, 0, len / 2]}>
        <boxGeometry args={[Math.max(0.028, dx * 0.42), 0.035, len]} />
        <meshStandardMaterial color={GOLD} metalness={0.92} roughness={0.28} />
      </mesh>,
    )
  }
  return <group position={[x0, y, 0.08]}>{pins}</group>
}

function HeaderStrip({ x, y, w, h, cols = 1, pins = 20 }) {
  const plastic = (
    <mesh position={[0, 0, 0.005]}>
      <boxGeometry args={[w, h, 0.04]} />
      <meshStandardMaterial color={PLASTIC} metalness={0.2} roughness={0.7} />
    </mesh>
  )
  const spacing = h / (pins + 1)
  const pinCols = []
  for (let p = 0; p < pins; p++) {
    const py = -h / 2 + spacing * (p + 1)
    for (let c = 0; c < cols; c++) {
      const px = cols > 1 ? -w / 4 + c * (w / 2) : 0
      pinCols.push(
        <mesh key={`${p}-${c}`} position={[px, py, 0.045]}>
          <boxGeometry args={[Math.max(0.028, w * 0.16), 0.03, 0.1]} />
          <meshStandardMaterial color={GOLD} metalness={0.92} roughness={0.28} />
        </mesh>,
      )
    }
  }
  return (
    <group position={[x, y, 0.08]}>
      {plastic}
      {pinCols}
    </group>
  )
}

function Usb({ x, y, w, h, inner = false }) {
  return (
    <group position={[x, y, 0.11]}>
      <mesh>
        <boxGeometry args={[w, h, 0.05]} />
        <meshStandardMaterial color={SILVER} metalness={0.9} roughness={0.3} />
      </mesh>
      {inner && (
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[w * 0.55, h * 0.4, 0.014]} />
          <meshStandardMaterial color={BLACK} metalness={0.2} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

function Ether({ x, y, w = 0.55, h = 0.26 }) {
  return (
    <group position={[x, y, 0.11]}>
      <mesh>
        <boxGeometry args={[w, h, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.026]}>
        <boxGeometry args={[w * 0.55, h * 0.45, 0.016]} />
        <meshStandardMaterial color="#33250f" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Button({ x, y, s = 0.07 }) {
  return (
    <mesh position={[x, y, 0.12]}>
      <boxGeometry args={[s, s, 0.06]} />
      <meshStandardMaterial color={BLACK} metalness={0.3} roughness={0.5} />
    </mesh>
  )
}

function Led({ x, y, color }) {
  return (
    <mesh position={[x, y, 0.12]}>
      <boxGeometry args={[0.045, 0.045, 0.06]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
    </mesh>
  )
}

function Can({ x, y, r = 0.07 }) {
  return (
    <group position={[x, y, 0.11]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.04, 24]} />
        <meshStandardMaterial color={SILVER} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.7, r * 0.7, 0.012, 24]} />
        <meshStandardMaterial color="#8a8f94" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Barrel({ x, y }) {
  return (
    <group position={[x, y, 0.11]} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 20]} />
        <meshStandardMaterial color={BLACK} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Icsps({ x, y }) {
  const pins = []
  const spacing = 0.09
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      pins.push(
        <mesh key={`${r}-${c}`} position={[x + (c - 1) * spacing, y + (r - 0.5) * spacing, 0.14]}>
          <boxGeometry args={[0.045, 0.045, 0.09]} />
          <meshStandardMaterial color={GOLD} metalness={0.92} roughness={0.28} />
        </mesh>,
      )
    }
  }
  return <group>{pins}</group>
}

function Sd({ x, y, w, h }) {
  return (
    <mesh position={[x, y, 0.085]}>
      <boxGeometry args={[w, h, 0.02]} />
      <meshStandardMaterial color={BLACK} metalness={0.2} roughness={0.6} />
    </mesh>
  )
}

function Regulator({ x, y }) {
  return (
    <group position={[x, y, 0.1]}>
      <mesh>
        <boxGeometry args={[0.22, 0.34, 0.05]} />
        <meshStandardMaterial color={BLACK} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.16, 0.2, 0.01]} />
        <meshStandardMaterial color="#2a333d" />
      </mesh>
    </group>
  )
}

/* ---------- per-board layouts (local coords, slab top z=0.08) ---------- */

function arduinoDetails(w, h) {
  return (
    <group>
      <Chip x={-0.3} y={0.15} w={0.95} h={0.5} />
      <PinRow x0={-w / 2 + 0.18} y={h / 2 - 0.1} dx={0.19} n={Math.floor((w - 0.36) / 0.19)} />
      <PinRow x0={-w / 2 + 0.18} y={-h / 2 + 0.1} dx={0.19} n={Math.floor((w - 0.36) / 0.19)} />
      <Usb x={0.35} y={-h / 2 + 0.12} w={0.6} h={0.2} inner />
      <Barrel x={-w / 2 + 0.22} y={-h / 2 + 0.2} />
      <Icsps x={0.55} y={0.62} />
      <Button x={0.78} y={-0.5} s={0.09} />
      <Can x={0.5} y={-0.28} r={0.06} />
      <Regulator x={-0.3} y={-0.62} />
      <Led x={0.18} y={h / 2 - 0.18} color={GREEN} />
      <Led x={0.28} y={h / 2 - 0.18} color={YELLOW} />
      <Led x={0.38} y={h / 2 - 0.18} color={RED} />
    </group>
  )
}

function piDetails(w, h) {
  const n = Math.floor((h - 0.4) / 0.1)
  return (
    <group>
      <Chip x={-0.25} y={0.05} w={1.45} h={1.0} silver />
      <HeaderStrip x={w / 2 - 0.14} y={0} w={0.16} h={h - 0.35} cols={2} pins={n} />
      <Usb x={-0.35} y={-h / 2 + 0.12} w={0.52} h={0.2} />
      <Usb x={0.42} y={-h / 2 + 0.12} w={0.52} h={0.2} />
      <Ether x={-0.95} y={-h / 2 + 0.14} w={0.5} h={0.24} />
      <Usb x={-1.0} y={h / 2 - 0.1} w={0.34} h={0.16} />
      <Chip x={0.45} y={-0.62} w={0.5} h={0.26} />
      <Chip x={0.45} y={-0.26} w={0.5} h={0.26} />
      <Sd x={w / 2 - 0.25} y={-h / 2 + 0.08} w={0.4} h={0.09} />
      <Can x={-0.55} y={0.62} r={0.06} />
      <Led x={0.7} y={h / 2 - 0.15} color={GREEN} />
      <Led x={0.8} y={h / 2 - 0.15} color={RED} />
    </group>
  )
}

function esp32Details(w, h) {
  return (
    <group>
      <RoundedBox args={[1.35, 1.05, 0.07]} radius={0.04} smoothness={2} position={[0, 0.05, 0.115]}>
        <meshStandardMaterial color="#2a3036" metalness={0.85} roughness={0.3} />
      </RoundedBox>
      <mesh position={[-0.35, 0.05, 0.155]}>
        <boxGeometry args={[0.22, 0.22, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
      </mesh>
      <PinRow x0={-w / 2 + 0.09} y={-h / 2 + 0.16} dx={0.1} n={Math.floor((h - 0.3) / 0.1)} len={0.07} />
      <PinRow x0={w / 2 - 0.09} y={-h / 2 + 0.16} dx={0.1} n={Math.floor((h - 0.3) / 0.1)} len={0.07} />
      <Usb x={0} y={h / 2 - 0.1} w={0.55} h={0.18} inner />
      <Button x={-0.45} y={-h / 2 + 0.15} s={0.075} />
      <Button x={0.45} y={-h / 2 + 0.15} s={0.075} />
      <Can x={0.45} y={-0.5} r={0.055} />
      <Led x={0.62} y={h / 2 - 0.14} color={RED} />
    </group>
  )
}

function stm32Details(w, h) {
  return (
    <group>
      <Chip x={0} y={0.15} w={0.95} h={0.95} />
      <PinRow x0={-w / 2 + 0.12} y={-h / 2 + 0.18} dx={0.1} n={Math.floor((h - 0.36) / 0.1)} />
      <PinRow x0={w / 2 - 0.12} y={-h / 2 + 0.18} dx={0.1} n={Math.floor((h - 0.36) / 0.1)} />
      <Usb x={0} y={-h / 2 + 0.12} w={0.42} h={0.18} />
      <Can x={-0.55} y={-0.5} r={0.06} />
      <Button x={0.5} y={-0.62} s={0.075} />
      <Button x={0.32} y={0.72} s={0.06} />
      <Led x={0.62} y={h / 2 - 0.16} color={RED} />
    </group>
  )
}

function beagleboneDetails(w, h) {
  const pins = Math.floor((h - 0.3) / 0.075)
  return (
    <group>
      <Chip x={-0.25} y={0} w={1.3} h={1.1} silver />
      <HeaderStrip x={-w / 2 + 0.16} y={0} w={0.18} h={h - 0.3} cols={2} pins={pins} />
      <HeaderStrip x={w / 2 - 0.16} y={0} w={0.18} h={h - 0.3} cols={2} pins={pins} />
      <Ether x={-0.9} y={-h / 2 + 0.14} w={0.5} h={0.24} />
      <Usb x={0.35} y={-h / 2 + 0.12} w={0.45} h={0.18} />
      <Sd x={0.85} y={h / 2 - 0.07} w={0.42} h={0.09} />
      <Chip x={0.45} y={0.55} w={0.42} h={0.28} />
      <Led x={-0.55} y={h / 2 - 0.16} color={GREEN} />
      <Led x={-0.44} y={h / 2 - 0.16} color={GREEN} />
      <Led x={-0.33} y={h / 2 - 0.16} color={GREEN} />
      <Led x={-0.22} y={h / 2 - 0.16} color={RED} />
    </group>
  )
}

export default function BoardDetails({ part, w, h }) {
  switch (part.id) {
    case 'arduino':
      return arduinoDetails(w, h)
    case 'raspberry-pi':
      return piDetails(w, h)
    case 'esp32':
      return esp32Details(w, h)
    case 'stm32':
      return stm32Details(w, h)
    case 'beaglebone':
      return beagleboneDetails(w, h)
    default:
      return null
  }
}
