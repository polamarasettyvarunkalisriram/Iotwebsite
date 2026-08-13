import { Link } from 'react-router-dom'
import { Cpu, Github, Twitter, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <Cpu size={20} />
          </div>
          <div>
            <h3>IoT Explorer</h3>
            <p>
              An interactive educational platform for students, developers and IoT enthusiasts to
              understand IoT devices and hardware through hands-on visual learning.
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Learn</h4>
          <ul>
            <li><button className="footer-link" onClick={() => scrollTo('assembly')}>Board Assembly</button></li>
            <li><button className="footer-link" onClick={() => scrollTo('components')}>Components</button></li>
            <li><button className="footer-link" onClick={() => scrollTo('iot')}>IoT Applications</button></li>
            <li><button className="footer-link" onClick={() => scrollTo('pros-cons')}>Pros & Cons</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-row">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 IoT Explorer. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
