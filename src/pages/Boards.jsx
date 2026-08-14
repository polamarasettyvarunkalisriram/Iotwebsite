import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BoardViewer from '../components/BoardViewer.jsx'
import { iotboard } from '../data/devices.js'
import { compareBoards, compareRows } from '../data/compare.js'

export default function Boards() {
  return (
    <>
      <Navbar />

      <section className="explorer-hero">
        <div className="container">
          <span className="section-eyebrow">Interactive 3D Laboratory</span>
          <h1 className="explorer-title">
            Explore the <span className="grad">IoT Board</span>
          </h1>
          <p className="explorer-sub">
            {iotboard.full}. Rotate the board, hover a module to identify it, click to read its
            details, and disassemble the board to see every brain inside.
          </p>
        </div>
      </section>

      <section className="explorer-stage container">
        <BoardViewer />
      </section>

      <section className="explorer-compare container">
        <span className="section-eyebrow">Side by Side</span>
        <h2 className="explorer-subtitle">Compare the Five Brains</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-corn">Metric</th>
                {compareBoards.map((b) => (
                  <th key={b.id} style={{ '--part-color': b.color }}>
                    <i className="dot" /> {b.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <td className="compare-label">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  )
}
