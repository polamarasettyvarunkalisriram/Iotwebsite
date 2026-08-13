import { useRef } from 'react'
import ArduinoBoard from './ArduinoBoard.jsx'

export default function Arduino3D({ disassembled, onSelect, selectedId }) {
  const sceneRef = useRef(null)

  const handleMove = (e) => {
    const el = sceneRef.current
    if (!el || window.matchMedia('(max-width: 768px)').matches) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${52 - dy * 16}deg`)
    el.style.setProperty('--ry', `${dx * 18}deg`)
  }

  const handleLeave = () => {
    const el = sceneRef.current
    if (!el) return
    el.style.setProperty('--rx', '52deg')
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
      className={`board-scene${selectedId ? ' selected-part' : ''}`}
      ref={sceneRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="board-sway">
        <div className="board-3d">
          <ArduinoBoard
            onSelect={onSelect}
            selectedId={selectedId}
            transformFor={transformFor}
            labelVisible={disassembled}
            smooth
          />
        </div>
      </div>
    </div>
  )
}
