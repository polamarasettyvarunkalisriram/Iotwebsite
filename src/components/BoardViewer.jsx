import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, ZoomIn, ZoomOut, Cpu } from 'lucide-react'
import IoTBoardCanvas from './three/IoTBoardCanvas.jsx'
import PartInfoCard from './PartInfoCard.jsx'
import { iotboard } from '../data/devices.js'

function zoomControls(controls, dir) {
  if (!controls) return
  const c = controls
  const scale = dir === 'in' ? 0.8 : 1.25
  if (typeof c.dolly === 'function') c.dolly(scale)
  else if (typeof c.dollyIn === 'function') (dir === 'in' ? c.dollyIn(0.8) : c.dollyOut(1.25))
  if (typeof c.update === 'function') c.update()
}

export default function BoardViewer({ compact = false }) {
  const [selected, setSelected] = useState(null)
  const [dis, setDis] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const controlsRef = useRef(null)

  const selectedPart = selected ? iotboard.parts.find((p) => p.id === selected) || null : null

  const reset = () => setResetSignal((s) => s + 1)

  return (
    <div className={`board-viewer${compact ? ' compact' : ''}`}>
      <div
        className="viewer-canvas"
        onMouseEnter={() => setDis(true)}
        onMouseLeave={() => {
          if (!selected) setDis(false)
        }}
      >
        <IoTBoardCanvas
          selected={selected}
          onSelect={setSelected}
          phase={dis ? 1 : 0}
          controlsRef={controlsRef}
          resetSignal={resetSignal}
        />
        <div className="viewer-hint">Hover to disassemble · Drag to rotate · Scroll to zoom</div>

        {!compact && (
          <div className="viewer-toolbar">
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => zoomControls(controlsRef.current, 'in')} title="Zoom in">
              <ZoomIn size={17} />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={() => zoomControls(controlsRef.current, 'out')} title="Zoom out">
              <ZoomOut size={17} />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} onClick={reset} title="Reset view">
              <RotateCcw size={17} />
            </motion.button>
          </div>
        )}
      </div>

      {!compact && (
        <div className="viewer-chips">
          {iotboard.parts.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className={`viewer-chip${selected === p.id ? ' active' : ''}`}
              style={{ '--part-color': p.color }}
              onClick={() => setSelected(p.id === selected ? null : p.id)}
            >
              <i className="dot" /> {p.name}
            </motion.button>
          ))}
        </div>
      )}

      {compact && (
        <div className="viewer-compact-actions">
          <button onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={() => setSelected(iotboard.parts[0].id)}>
            <Cpu size={15} /> Explore
          </button>
        </div>
      )}

      {selectedPart && <PartInfoCard part={selectedPart} onClose={() => setSelected(null)} />}
    </div>
  )
}
