import { Target, BookOpen, Wrench } from 'lucide-react'

const items = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'Make IoT and electronics concepts easy to grasp through interactive, hands-on visual learning.',
  },
  {
    icon: BookOpen,
    title: 'What We Teach',
    desc: 'Every component explained simply — what it is, how it is used, and its honest pros and cons.',
  },
  {
    icon: Wrench,
    title: 'Why It Matters',
    desc: 'Start with real hardware and build the foundation for smart, connected devices.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="about-section section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">About Us</span>
          <h2 className="section-title">
            An Interactive Way to <span className="grad">Learn IoT</span>
          </h2>
          <p className="section-desc">
            We turn real IoT boards into something you can explore with your eyes — zoom in,
            take them apart, click any part and understand exactly what it does.
          </p>
        </div>

        <div className="about-home-grid">
          {items.map((it, i) => {
            const Icon = it.icon
            return (
              <div key={i} className={`about-home-card glass reveal reveal-delay-${i % 3}`}>
                <div className="about-home-icon">
                  <Icon size={22} />
                </div>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="about-home-cta reveal">
          <a href="#about" className="btn btn-ghost">
            Learn More About Us
          </a>
        </div>
      </div>
    </section>
  )
}
