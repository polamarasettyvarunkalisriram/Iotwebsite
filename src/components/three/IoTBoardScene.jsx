import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Module3D, { BOARD_W, BOARD_H } from './Module3D.jsx'
import { iotboard } from '../../data/devices.js'

const HOME_POS = new THREE.Vector3(0, 1.4, 9.5)

function ResetTween({ signal, controls }) {
  const { camera } = useThree()
  const from = useRef(new THREE.Vector3())
  const fromTarget = useRef(new THREE.Vector3())
  const t = useRef(1)

  useEffect(() => {
    if (!signal) return
    from.current.copy(camera.position)
    fromTarget.current.copy(controls.current?.target || new THREE.Vector3(0, 0, 0))
    t.current = 0
  }, [signal, camera, controls])

  useFrame((_, dt) => {
    if (t.current >= 1) return
    t.current = Math.min(1, t.current + dt * 2.6)
    const k = t.current < 0.5 ? 4 * t.current ** 3 : 1 - Math.pow(-2 * t.current + 2, 3) / 2
    camera.position.lerpVectors(from.current, HOME_POS, k)
    if (controls.current) {
      controls.current.target.lerpVectors(fromTarget.current, new THREE.Vector3(0, 0, 0), k)
      controls.current.update()
    }
  })

  return null
}

function PCB() {
  return (
    <group>
      <RoundedBox args={[BOARD_W + 0.06, BOARD_H + 0.06, 0.2]} radius={0.12} smoothness={3} position={[0, 0, -0.1]}>
        <meshStandardMaterial color="#06202b" metalness={0.5} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[BOARD_W, BOARD_H, 0.16]} radius={0.1} smoothness={3} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#0a2432" metalness={0.4} roughness={0.5} />
      </RoundedBox>

      <RoundedBox args={[BOARD_W * 0.92, 0.03, 0.01]} radius={0.01} smoothness={2} position={[0, BOARD_H / 2 - 0.06, 0.002]}>
        <meshStandardMaterial color="#0aa7bd" emissive="#0aa7bd" emissiveIntensity={0.35} />
      </RoundedBox>

      <RoundedBox args={[1.7, 0.42, 0.03]} radius={0.015} smoothness={2} position={[0, BOARD_H / 2 - 0.35, 0.004]}>
        <meshStandardMaterial color="#0aa7bd" emissive="#0aa7bd" emissiveIntensity={0.25} />
      </RoundedBox>
    </group>
  )
}

export default function IoTBoardScene({ selected, onSelect, phase, controlsRef, resetSignal }) {
  const [hovered, setHovered] = useState(null)

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 5]} intensity={1.15} />
      <pointLight position={[-6, 3, 5]} intensity={30} decay={0} color="#0aa7bd" />
      <pointLight position={[6, -2, 4]} intensity={12} decay={0} color="#e0189c" />
      <pointLight position={[0, 4, -3]} intensity={8} decay={0} color="#3b82f6" />

      <PCB />

      {iotboard.parts.map((p, i) => (
        <Module3D
          key={p.id}
          part={p}
          index={i}
          phase={phase}
          dimmed={!!selected && selected !== p.id}
          hovered={hovered === p.id}
          selected={selected === p.id}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}

      <ContactShadows position={[0, -BOARD_H / 2 - 0.02, 0]} scale={16} blur={2.6} far={5} opacity={0.45} />

      <gridHelper
        args={[40, 40, '#0e7490', '#0c2a3a']}
        position={[0, -BOARD_H / 2 - 0.05, 0]}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        minDistance={4}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0, 0]}
      />

      <ResetTween signal={resetSignal} controls={controlsRef} />
    </>
  )
}
