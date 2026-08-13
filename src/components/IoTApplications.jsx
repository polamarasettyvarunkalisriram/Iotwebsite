import { iotApplications } from '../data/arduinoComponents.js'
import { iconMap } from '../data/iconMap.js'
import { Lightbulb } from 'lucide-react'

export default function IoTApplications() {
  return (
    <section id="iot" className="section iot-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">Real-World Impact</span>
          <h2 className="section-title">
            Devices in the <span className="grad">World of IoT</span>
          </h2>
          <p className="section-desc">
            Microcontrollers and single-board computers are the gateway to the Internet of Things.
            Here are six ways they power connected devices in the real world.
          </p>
        </div>

        <div className="iot-grid">
          {iotApplications.map((app, i) => {
            const Icon = iconMap[app.icon] || Lightbulb
            return (
              <div key={app.id} className={`iot-card glass reveal reveal-delay-${i % 4}`}>
                <div className="iot-icon">
                  <Icon size={22} />
                </div>
                <h3>{app.name}</h3>
                <p className="iot-short">{app.short}</p>
                <div className="iot-example">
                  <span className="iot-tag">Example</span>
                  {app.example}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
