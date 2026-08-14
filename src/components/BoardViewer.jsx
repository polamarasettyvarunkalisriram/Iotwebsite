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
   <div></div>
  )
}
