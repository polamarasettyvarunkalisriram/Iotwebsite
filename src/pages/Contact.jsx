import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Send,
  CircleCheck,
} from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@arduinoiotexplorer.dev',
    href: 'mailto:hello@arduinoiotexplorer.dev',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 010-2030',
    href: 'tel:+15550102030',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Innovation Hub, Makers City',
    href: null,
  },
]

const socials = [
  { icon: Github, label: 'GitHub' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
    setSent(false)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!emailPattern.test(form.email.trim())) e.email = 'Please enter a valid email address.'
    if (!form.subject.trim()) e.subject = 'Subject is required.'
    if (!form.message.trim()) e.message = 'Message is required.'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
    return e
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Contact</span>
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-sub">
            Questions about IoT, feedback on our interactive boards, or ideas for new
            educational content? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-section section">
        <div className="container contact-grid">
          <div className="contact-info reveal">
            <h2 className="contact-info-title">Let&apos;s Build Something Together</h2>
            <p className="contact-info-desc">
              Reach out for learning resources, project guidance or partnership opportunities. We
              reply to every message within 24 hours.
            </p>

            <div className="contact-cards">
              {contacts.map((c, i) => {
                const Icon = c.icon
                const inner = (
                  <>
                    <div className="contact-card-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="contact-card-label">{c.label}</span>
                      <span className="contact-card-value">{c.value}</span>
                    </div>
                  </>
                )
                return c.href ? (
                  <a key={i} href={c.href} className="contact-card glass">
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="contact-card glass">
                    {inner}
                  </div>
                )
              })}
            </div>

            <div className="contact-socials">
              <span className="contact-socials-label">Follow us</span>
              <div className="social-row">
                {socials.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={i}
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <form className="contact-form glass reveal reveal-delay-1" onSubmit={onSubmit} noValidate>
            <h3>Send us a Message</h3>

            {sent && (
              <div className="form-success" role="status">
                <CircleCheck size={20} />
                <div>
                  <strong>Message sent!</strong>
                  <span>Thank you for reaching out. We will get back to you soon.</span>
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={setField('name')}
                className={errors.name ? 'invalid' : ''}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={setField('email')}
                className={errors.email ? 'invalid' : ''}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Learning resource request"
                value={form.subject}
                onChange={setField('subject')}
                className={errors.subject ? 'invalid' : ''}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us what you would like to learn or build..."
                value={form.message}
                onChange={setField('message')}
                className={errors.message ? 'invalid' : ''}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary form-submit">
              Send Message <Send size={17} />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}
