import { advantages, disadvantages } from '../data/arduinoComponents.js'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function Advantages() {
  return (
    <section id="pros-cons" className="section adv-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">Balanced View</span>
          <h2 className="section-title">
            Advantages & <span className="grad">Disadvantages</span>
          </h2>
        </div>

        <div className="adv-grid">
          <div className="adv-card glass adv-good reveal">
            <div className="adv-head">
              <div className="adv-icon good">
                <CheckCircle2 size={24} />
              </div>
              <h3>Advantages</h3>
            </div>
            <ul className="adv-list">
              {advantages.map((item, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} className="mark good" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="adv-card glass adv-bad reveal reveal-delay-1">
            <div className="adv-head">
              <div className="adv-icon bad">
                <XCircle size={24} />
              </div>
              <h3>Disadvantages</h3>
            </div>
            <ul className="adv-list">
              {disadvantages.map((item, i) => (
                <li key={i}>
                  <XCircle size={16} className="mark bad" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
