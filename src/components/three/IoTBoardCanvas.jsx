import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import IoTBoardScene from './IoTBoardScene.jsx'

export default function IoTBoardCanvas({ selected, onSelect, phase, controlsRef, resetSignal }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 9.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="iot-canvas"
    >
      <Suspense fallback={null}>
        <IoTBoardScene
          selected={selected}
          onSelect={onSelect}
          phase={phase}
          controlsRef={controlsRef}
          resetSignal={resetSignal}
        />
      </Suspense>
    </Canvas>
  )
}
