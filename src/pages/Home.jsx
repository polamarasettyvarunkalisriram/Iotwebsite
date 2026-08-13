import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import AssemblyAnimation from '../components/AssemblyAnimation.jsx'
import ComponentExplorer from '../components/ComponentExplorer.jsx'
import IoTApplications from '../components/IoTApplications.jsx'
import Advantages from '../components/Advantages.jsx'
import ComponentInfo from '../components/ComponentInfo.jsx'
import ContactSection from '../components/ContactSection.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <AssemblyAnimation onSelect={setSelected} selectedId={selected?.id} />
      <ComponentExplorer onSelect={setSelected} />
      <IoTApplications />
      <Advantages />
      <ContactSection />
      <Footer />
      <ComponentInfo component={selected} onClose={() => setSelected(null)} />
    </>
  )
}
