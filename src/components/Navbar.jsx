import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Cpu } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [section, setSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    if (location.pathname !== '/') {
      setSection('home')
      return
    }
    const sections = [
      ['about', 'about'],
      ['components', 'components'],
      ['contact', 'contact'],
    ]
    let raf
    const compute = () => {
      const mid = window.innerHeight * 0.5
      let best = 'home'
      let bestDist = Math.abs(0 - mid)
      sections.forEach(([id, name]) => {
        const el = document.getElementById(id)
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs((r.top + r.bottom) / 2 - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = name
        }
      })
      setSection(best)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  const handleHome = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      setOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
    return !!el
  }

  const onHome = location.pathname === '/'
  const isActiveLink = (routeActive, id) =>
    onHome ? section === id : routeActive

  const handleSectionNav = (e, id, path) => {
    if (location.pathname === '/') {
      e.preventDefault()
      if (!scrollTo(id)) navigate(path)
    }
  }

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="IoT Explorer home">
          <span className="brand-logo">
            <Cpu size={22} strokeWidth={1.6} />
          </span>
          <span className="brand-name">
            IoT Explorer
            <small>Built to Grow</small>
          </span>
        </Link>

        <nav className={`nav-links${open ? ' open' : ''}`}>
          <NavLink
            to="/"
            end
            onClick={handleHome}
            className={({ isActive }) =>
              `nav-link${isActiveLink(isActive, 'home') ? ' active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={(e) => handleSectionNav(e, 'about', '/about')}
            className={({ isActive }) =>
              `nav-link${isActiveLink(isActive, 'about') ? ' active' : ''}`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/components"
            onClick={(e) => handleSectionNav(e, 'components', '/components')}
            className={({ isActive }) =>
              `nav-link${isActiveLink(isActive, 'components') ? ' active' : ''}`
            }
          >
            Components
          </NavLink>
          <NavLink
            to="/boards"
            onClick={(e) => handleSectionNav(e, 'explorer', '/boards')}
            className={({ isActive }) =>
              `nav-link${isActiveLink(isActive, 'explorer') ? ' active' : ''}`
            }
          >
            Explorer
          </NavLink>
          <NavLink
            to="/contact"
            onClick={(e) => handleSectionNav(e, 'contact', '/contact')}
            className={({ isActive }) =>
              `nav-link${isActiveLink(isActive, 'contact') ? ' active' : ''}`
            }
          >
            Contact Us
          </NavLink>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            className={`nav-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
