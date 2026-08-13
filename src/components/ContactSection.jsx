import { Mail, Phone, MapPin, Send } from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'srirampksrirampk@gmail.com',
    href: 'mailto:srirampksrirampk@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 93981 71713',
    href: 'tel:+919398171713',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Innovation Hub, Makers City',
    href: null,
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title">
            Let&apos;s Build Something <span className="grad">Together</span>
          </h2>
          <p className="section-desc">
            Questions about IoT, feedback on our interactive boards, or ideas for new educational
            content? We would love to hear from you.
          </p>
        </div>

        <div className="about-home-grid">
          {contacts.map((c, i) => {
            const Icon = c.icon
            const inner = (
              <>
                <div className="about-home-icon">
                  <Icon size={22} />
                </div>
                <h3>{c.label}</h3>
                <p>{c.value}</p>
              </>
            )
            return c.href ? (
              <a key={i} href={c.href} className={`about-home-card glass reveal reveal-delay-${i}`}>
                {inner}
              </a>
            ) : (
              <div key={i} className={`about-home-card glass reveal reveal-delay-${i}`}>
                {inner}
              </div>
            )
          })}
        </div>

        <div className="about-home-cta reveal">
          <a href="mailto:srirampksrirampk@gmail.com" className="btn btn-primary">
            Send us a Message <Send size={17} />
          </a>
        </div>
      </div>
    </section>
  )
}
