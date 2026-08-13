import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ArduinoBoard from '../components/ArduinoBoard.jsx'
import {
  Target,
  BookOpen,
  Globe,
  Scale,
  Eye,
  MousePointerClick,
  GraduationCap,
  Wrench,
  Cpu,
  Radio,
} from 'lucide-react'

const provides = [
  {
    icon: MousePointerClick,
    title: 'Interactive Component Exploration',
    desc: 'Click any part of the 3D board to discover what it does and how it works.',
  },
  {
    icon: BookOpen,
    title: 'Hardware Explanations',
    desc: 'Simple, clear descriptions of every major board component.',
  },
  {
    icon: Globe,
    title: 'IoT Application Examples',
    desc: 'Real-world projects showing how boards connect devices to the internet.',
  },
  {
    icon: Scale,
    title: 'Advantages & Disadvantages',
    desc: 'An honest, balanced view so you pick the right tool for the job.',
  },
  {
    icon: Eye,
    title: 'Visual Learning',
    desc: 'Disassembly and assembly animations bring the hardware to life.',
  },
]

const whyArduino = [
  {
    icon: GraduationCap,
    title: 'Beginner Friendly',
    desc: 'A gentle learning curve makes this board the standard starting point for electronics and embedded systems.',
  },
  {
    icon: Cpu,
    title: 'Real Hardware',
    desc: 'You work with actual components — pins, sensors and circuits — not just simulations.',
  },
  {
    icon: Wrench,
    title: 'Rapid Prototyping',
    desc: 'Ideas go from sketch to working prototype in hours, perfect for experimenting.',
  },
  {
    icon: Radio,
    title: 'IoT Foundation',
    desc: 'Pair the board with Wi-Fi or LoRa modules and you are building the Internet of Things.',
  },
]

export default function About() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <span className="section-eyebrow">About Us</span>
          <h1 className="page-title">About IoT Explorer</h1>
          <p className="page-sub">
            An educational platform designed to help students, developers and IoT enthusiasts
            understand connected devices through an interactive visual experience.
          </p>
        </div>
      </section>

      <section className="about-mission section">
        <div className="container about-grid">
          <div className="about-copy reveal">
            <div className="about-badge">
              <Target size={22} />
            </div>
            <h2 className="section-title">
              Our <span className="grad">Mission</span>
            </h2>
            <p className="about-text">
              Help beginners understand IoT and electronics concepts easily. We believe hardware
              should be experienced, not just read about — so we turned real IoT boards into
              interactive 3D models you can take apart, click and rebuild.
            </p>
            <p className="about-text">
              Every component opens a clear, honest explanation: what it is, how it is used, its
              strengths and its limitations. No jargon, no shortcuts — just practical knowledge
              anyone can build on.
            </p>
          </div>

          <div className="about-visual reveal reveal-delay-1">
            <div className="about-board-card glass">
              <ArduinoBoard flat />
              <div className="about-board-note">
                <MousePointerClick size={15} />
                The very board you can explore on our Home page
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-provide section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="section-eyebrow">What We Provide</span>
            <h2 className="section-title">
              Learning Tools Built for <span className="grad">Curiosity</span>
            </h2>
          </div>

          <div className="about-provide-grid">
            {provides.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className={`provide-card glass reveal reveal-delay-${i % 3}`}>
                  <div className="provide-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="about-why section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="section-eyebrow">Why These Boards?</span>
            <h2 className="section-title">
              The Best Place to <span className="grad">Start Building</span>
            </h2>
            <p className="section-desc">
              A simple, approachable board is the ideal gateway into electronics, embedded systems
              and the Internet of Things.
            </p>
          </div>

          <div className="about-why-grid">
            {whyArduino.map((w, i) => {
              const Icon = w.icon
              return (
                <div key={i} className={`why-card glass reveal reveal-delay-${i % 2}`}>
                  <div className="why-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
