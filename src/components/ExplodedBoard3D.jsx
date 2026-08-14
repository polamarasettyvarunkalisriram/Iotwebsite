import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import PartInfoCard from './PartInfoCard.jsx'

/* Port of the standalone `exploded_board_3d.html` scene, enhanced:
   real-time shadows, environment reflections, glow (bloom), a soft
   floor and a gentle idle camera orbit so it reads as a real 3D view. */
export default function ExplodedBoard3D() {
  const holderRef = useRef(null)
  const tooltipRef = useRef(null)
  const hintRef = useRef(null)
  const [part, setPart] = useState(null)

  useEffect(() => {
    const holder = holderRef.current
    const tooltip = tooltipRef.current
    const hintEl = hintRef.current
    if (!holder || !tooltip || !hintEl) return

    let width = holder.clientWidth || 1200
    let height = holder.clientHeight || 600

    // ---------- basic setup ----------
    const scene = new THREE.Scene()

    const bgCanvas = document.createElement('canvas')
    bgCanvas.width = 1024
    bgCanvas.height = 1024
    const bgCtx = bgCanvas.getContext('2d')
    const bgGrad = bgCtx.createLinearGradient(0, 0, 1024, 1024)
    bgGrad.addColorStop(0, '#23496b')
    bgGrad.addColorStop(1, '#0f2438')
    bgCtx.fillStyle = bgGrad
    bgCtx.fillRect(0, 0, 1024, 1024)
    bgCtx.strokeStyle = 'rgba(140, 210, 255, 0.2)'
    bgCtx.lineWidth = 1
    for (let i = 0; i <= 16; i++) {
      const pos = Math.round(i * 64)
      bgCtx.beginPath()
      bgCtx.moveTo(pos, 0)
      bgCtx.lineTo(pos, 1024)
      bgCtx.stroke()
      bgCtx.beginPath()
      bgCtx.moveTo(0, pos)
      bgCtx.lineTo(1024, pos)
      bgCtx.stroke()
    }
    const bgTex = new THREE.CanvasTexture(bgCanvas)
    bgTex.colorSpace = THREE.SRGBColorSpace
    scene.background = bgTex

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    holder.appendChild(renderer.domElement)

    // environment reflections
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    // glow post-processing
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(width, height)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.42, 0.6, 0.85)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // ---------- lights ----------
    scene.add(new THREE.AmbientLight(0x3a4a6a, 0.7))
    const key = new THREE.DirectionalLight(0xfff4e6, 1.35)
    key.position.set(8, 16, 10)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -12
    key.shadow.camera.right = 12
    key.shadow.camera.top = 12
    key.shadow.camera.bottom = -12
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 40
    key.shadow.bias = -0.0005
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x4fc0e8, 0.7)
    rim.position.set(-10, 8, -8)
    scene.add(rim)
    const fillPoint = new THREE.PointLight(0x4fc0e8, 0.5, 40)
    fillPoint.position.set(0, 6, 6)
    scene.add(fillPoint)
    const underGlow = new THREE.PointLight(0xe0189c, 0.4, 30)
    underGlow.position.set(0, -2, 0)
    scene.add(underGlow)

    // ---------- orbit (manual + idle auto-rotate) ----------
    const target = new THREE.Vector3(0, 0.2, 0)
    let radius = 12.5
    let theta = Math.PI * 0.34
    let phi = Math.PI * 0.36
    const minPhi = 0.2
    const maxPhi = Math.PI / 2 - 0.05
    const updateCamera = () => {
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta)
      camera.position.y = target.y + radius * Math.cos(phi)
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta)
      camera.lookAt(target)
    }
    updateCamera()

    let dragging = false
    let lastX = 0
    let lastY = 0

    const onPointerDown = (e) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      theta -= dx * 0.0055
      phi -= dy * 0.0045
      phi = Math.max(minPhi, Math.min(maxPhi, phi))
      lastX = e.clientX
      lastY = e.clientY
      updateCamera()
    }
    const onPointerUp = () => {
      dragging = false
    }
    holder.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    const ro = new ResizeObserver(() => {
      width = holder.clientWidth || width
      height = holder.clientHeight || height
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
    })
    ro.observe(holder)

    // ---------- board group (so the whole board can bob) ----------
    const boardGroup = new THREE.Group()
    boardGroup.scale.setScalar(0.55)
    scene.add(boardGroup)

    // ---------- PCB base with procedural circuit texture ----------
    function makePcbTexture() {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 576
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#0c1c2e'
      ctx.fillRect(0, 0, c.width, c.height)
      const grad = ctx.createRadialGradient(c.width / 2, c.height / 2, 80, c.width / 2, c.height / 2, 700)
      grad.addColorStop(0, 'rgba(20,60,100,0.35)')
      grad.addColorStop(1, 'rgba(4,10,20,0.55)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.strokeStyle = 'rgba(120,200,240,0.18)'
      ctx.lineWidth = 1.4
      let rng = 12345
      const rand = () => {
        rng = (rng * 1103515245 + 12345) % 2147483648
        return rng / 2147483648
      }
      for (let i = 0; i < 130; i++) {
        let x = rand() * c.width
        let y = rand() * c.height
        ctx.beginPath()
        ctx.moveTo(x, y)
        const segs = 2 + Math.floor(rand() * 3)
        for (let s = 0; s < segs; s++) {
          if (rand() < 0.5) x += (rand() - 0.5) * 160
          else y += (rand() - 0.5) * 90
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(200,160,90,0.28)'
      for (let p = 0; p < 70; p++) {
        const px = rand() * c.width
        const py = rand() * c.height
        ctx.beginPath()
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      const tex = new THREE.CanvasTexture(c)
      tex.anisotropy = 4
      return tex
    }
    const pcbTex = makePcbTexture()
    const BOARD_W = 17.2
    const BOARD_D = 9.6
    const BOARD_H = 0.32
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.7, metalness: 0.25 })
    const pcbSideMat = new THREE.MeshStandardMaterial({ color: 0x081a26, roughness: 0.9 })
    const pcbGeo = new RoundedBoxGeometry(BOARD_W, BOARD_H, BOARD_D, 3, 0.1)
    const pcb = new THREE.Mesh(pcbGeo, [pcbSideMat, pcbSideMat, pcbMat, pcbSideMat, pcbSideMat, pcbSideMat])
    pcb.position.y = -BOARD_H / 2
    pcb.castShadow = true
    pcb.receiveShadow = true
    boardGroup.add(pcb)

    const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, BOARD_H * 1.4, 16)
    const holeMat = new THREE.MeshStandardMaterial({ color: 0xffd27a, metalness: 0.85, roughness: 0.25 })
    ;[[-8.2, -4.3], [8.2, -4.3], [-8.2, 4.3], [8.2, 4.3]].forEach((pos) => {
      const h = new THREE.Mesh(holeGeo, holeMat)
      h.position.set(pos[0], -BOARD_H / 2, pos[1])
      boardGroup.add(h)
    })

    // ---------- label sprites ----------
    function makeLabel(line1, line2) {
      const c = document.createElement('canvas')
      const scale = 3
      c.width = 340 * scale
      c.height = 92 * scale
      const ctx = c.getContext('2d')
      ctx.scale(scale, scale)
      ctx.clearRect(0, 0, 340, 92)
      ctx.fillStyle = 'rgba(6,14,26,0.88)'
      roundRect(ctx, 2, 2, 336, line2 ? 88 : 60, 10)
      ctx.fill()
      ctx.strokeStyle = 'rgba(79,192,232,0.6)'
      ctx.lineWidth = 1.5
      roundRect(ctx, 2, 2, 336, line2 ? 88 : 60, 10)
      ctx.stroke()
      ctx.fillStyle = '#eaf6ff'
      ctx.font = '600 22px "JetBrains Mono", monospace'
      ctx.textBaseline = 'top'
      ctx.fillText(line1, 16, 14)
      if (line2) {
        ctx.fillStyle = '#4fc0e8'
        ctx.font = '400 16px "JetBrains Mono", monospace'
        ctx.fillText(line2, 16, 46)
      }
      function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + w, y, x + w, y + h, r)
        ctx.arcTo(x + w, y + h, x, y + h, r)
        ctx.arcTo(x, y + h, x, y, r)
        ctx.arcTo(x, y, x + w, y, r)
        ctx.closePath()
      }
      const tex = new THREE.CanvasTexture(c)
      tex.minFilter = THREE.LinearFilter
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
      const sprite = new THREE.Sprite(mat)
      const aspect = c.width / c.height
      const h = 0.95
      sprite.scale.set(h * aspect, h, 1)
      sprite.renderOrder = 999
      return sprite
    }

    // ---------- component data ----------
    const comps = [
      {
        name: 'ESP32 DEVKIT', sub: 'Wi-Fi + Bluetooth', x: -6.1, z: -2.7, w: 2.2, d: 3.6, h: 0.32, col: 0x171a1c, lift: 5.2, group: 'mcu',
        icon: 'Radio', color: '#e63250',
        what: 'The ESP32 DevKit is a development board built around the ESP32 module — a dual-core chip with built-in 2.4GHz Wi-Fi and Bluetooth. It is the go-to choice for connected IoT projects.',
        uses: ['Wi-Fi and Bluetooth in one chip', 'Standalone IoT nodes without extra modules', 'MQTT, HTTP and OTA firmware updates', 'Programming from the Arduino IDE or MicroPython'],
        advantages: ['Built-in Wi-Fi and Bluetooth', 'Dual-core speed for an MCU', 'Very affordable'],
        disadvantages: ['Only 520KB RAM — no full Linux', 'Wi-Fi adds power consumption', 'No analog output pins'],
        examples: ['A temperature sensor pushing data to a cloud dashboard', 'A Wi-Fi relay that toggles a lamp from your phone'],
      },
      {
        name: 'ARDUINO NANO', sub: 'ATmega328P', x: -2.0, z: -2.7, w: 1.9, d: 3.6, h: 0.30, col: 0x0b4d9c, lift: 4.6, group: 'mcu',
        icon: 'Cpu', color: '#0aa7c7',
        what: 'The Arduino Nano is a compact development board based on the ATmega328P microcontroller. It is the classic beginner board — simple, reliable and perfect for learning embedded programming.',
        uses: ['Reading sensors and driving LEDs and relays', 'Running sketches from the Arduino IDE', 'Learning electronics and programming', 'Prototyping sensor and actuator circuits'],
        advantages: ['Very easy to learn', 'Low cost and widely available', 'Huge community and resources'],
        disadvantages: ['16MHz and 2KB RAM — limited power', 'No Wi-Fi or Bluetooth built in', 'Not suited to heavy computation'],
        examples: ['A home alarm reading PIR sensors and sounding a buzzer', 'A temperature logger storing readings every minute'],
      },
      {
        name: 'RASPBERRY PI PICO', sub: 'RP2040', x: 2.0, z: -2.7, w: 1.9, d: 3.6, h: 0.28, col: 0x1b7a3d, lift: 5.6, group: 'mcu',
        icon: 'Cpu', color: '#10b981',
        what: 'The Raspberry Pi Pico is a tiny microcontroller board powered by the dual-core RP2040 chip. It is famous for programmable I/O (PIO) and its excellent MicroPython support.',
        uses: ['MicroPython and C/C++ programming', 'Dual-core multitasking on a small board', 'Custom timing with the PIO engine', 'Low-power sensor and control projects'],
        advantages: ['Dual-core RP2040, very cheap', 'Programmable I/O (PIO) for custom signals', 'Great MicroPython support'],
        disadvantages: ['No Wi-Fi or Bluetooth built in', '3.3V logic only', 'Small RAM compared to Linux boards'],
        examples: ['A battery-powered environmental monitor', 'A PIO-driven LED strip controller'],
      },
      {
        name: 'STM32 BLUE PILL', sub: 'STM32F103C8T6', x: 6.1, z: -2.7, w: 2.1, d: 3.6, h: 0.30, col: 0x0d5fce, lift: 5.0, group: 'mcu',
        icon: 'Cpu', color: '#3b82f6',
        what: 'The STM32 Blue Pill is a low-cost development board based on the STM32F103C8T6 — a 72MHz ARM Cortex-M3 microcontroller. It packs huge power per dollar for embedded work.',
        uses: ['ARM microcontroller projects in Arduino or STM32Cube', 'USB devices and serial buses', 'Motor control and industrial sensing', 'Battery-powered embedded devices'],
        advantages: ['72MHz ARM core, very cheap', 'Rich peripherals (ADC, PWM, I2C, SPI, UART, USB)', 'Tiny 35x21mm footprint'],
        disadvantages: ['3.3V only — not 5V tolerant', 'No Wi-Fi or Bluetooth built in', 'Beginner documentation can be sparse'],
        examples: ['A USB gamepad or keyboard built around a Blue Pill', 'An analog data logger streaming over USB'],
      },

      {
        name: 'POWER LED', sub: '5V indicator', x: -8.35, z: -3.6, w: 0.42, d: 0.42, h: 0.24, col: 0x330b0b, lift: 2.0, group: 'left', emissive: 0xff2222, ei: 3,
        icon: 'Lightbulb', color: '#e63250',
        what: 'A small LED that lights up whenever 5V power is present on the board. It is the quickest way to confirm the board is powered on.',
        uses: ['Confirming the board is powered', 'Spotting a bad power supply at a glance', 'Debugging power issues without tools'],
        advantages: ['Zero setup, instant status', 'Works without any software'],
        disadvantages: ['Only an indicator — no control from code', 'Too dim to light a room'],
        examples: ['Checking power before wiring sensors', 'Verifying a supply is working on the bench'],
      },
      {
        name: 'USB TYPE-C', sub: 'Power input', x: -8.35, z: -2.15, w: 0.55, d: 0.85, h: 0.35, col: 0xc4c4c4, lift: 2.6, group: 'left',
        icon: 'Usb', color: '#0aa7c7',
        what: 'The USB-C port supplies 5V power to the board. Its reversible connector makes it easy to plug in any modern phone charger or power bank.',
        uses: ['Powering the board from a charger', 'Reversible plug — no upside-down issues', 'Portable builds powered by a power bank'],
        advantages: ['Modern reversible connector', 'Works with any USB-C supply'],
        disadvantages: ['Limited current from small chargers', 'Cable quality matters for stability'],
        examples: ['Running a portable sensor from a power bank', 'Feeding the board from a laptop USB-C port'],
      },
      {
        name: 'USB-TO-UART', sub: 'CH340C', x: -8.35, z: -0.55, w: 0.55, d: 0.6, h: 0.24, col: 0x151515, lift: 2.2, group: 'left',
        icon: 'Usb', color: '#0aa7c7',
        what: 'A CH340C chip converts USB signals from your computer into serial UART data the microcontroller understands. It is what lets you upload code and use the serial monitor over a single USB cable.',
        uses: ['Uploading sketches from the Arduino IDE', 'Serial monitor for debugging', 'Bridging USB and UART data'],
        advantages: ['Plug-and-play on most computers', 'Power and data over one cable'],
        disadvantages: ['Needs a driver on some systems', 'Only one serial port at a time'],
        examples: ['Printing debug messages while a project runs', 'Flashing firmware with one USB cable'],
      },
      {
        name: 'RESET BUTTON', sub: '', x: -8.35, z: 0.95, w: 0.5, d: 0.5, h: 0.3, col: 0x2c2c2c, lift: 2.4, group: 'left',
        icon: 'RotateCcw', color: '#0aa7c7',
        what: 'The reset button restarts the microcontroller, running your program again from the top. Handy for recovering a frozen project without unplugging the board.',
        uses: ['Restarting a hung program', 'Starting a clean boot without unplugging', 'Combined with BOOT for flashing mode'],
        advantages: ['Instant restart', 'No extra hardware needed'],
        disadvantages: ['Wipes the current program state', 'Can be pressed accidentally'],
        examples: ['Rebooting a stuck sensor node', 'Restarting a sketch while debugging'],
      },
      {
        name: 'BOOT BUTTON', sub: '', x: -8.35, z: 2.4, w: 0.5, d: 0.5, h: 0.3, col: 0x2c2c2c, lift: 2.6, group: 'left',
        icon: 'RotateCcw', color: '#e8930c',
        what: 'The BOOT button switches the chip into bootloader mode. Pressing it while resetting lets you upload new firmware when an automatic upload fails.',
        uses: ['Entering download mode for firmware upload', 'Recovering a board after a bad upload', 'Manual flashing fallback'],
        advantages: ['Allows manual firmware recovery', 'Simple and reliable fallback'],
        disadvantages: ['Needed only for troubleshooting', 'Easy to confuse with the reset button'],
        examples: ['Holding BOOT while resetting to flash new code', 'Recovering a chip stuck in a boot loop'],
      },

      {
        name: '5V DC POWER', sub: 'Barrel jack', x: 8.35, z: -3.6, w: 0.6, d: 0.9, h: 0.4, col: 0x121212, lift: 2.2, group: 'right',
        icon: 'Plug', color: '#e63250',
        what: 'A DC barrel jack that accepts an external 7–12V power supply. It feeds the onboard regulator so the board can run standalone from a wall adapter or battery.',
        uses: ['Powering the board from a wall adapter', 'Running standalone IoT nodes', 'Supplying more current than USB'],
        advantages: ['More power than USB', 'Accepts a wide voltage range'],
        disadvantages: ['Needs an extra adapter', 'Above 12V can overheat the regulator'],
        examples: ['A weather station running 24/7 from a wall adapter', 'A robot powered by a battery pack'],
      },
      {
        name: 'POWER SWITCH', sub: '', x: 8.35, z: -2.15, w: 0.55, d: 0.65, h: 0.35, col: 0x2c2c2c, lift: 2.6, group: 'right',
        icon: 'Zap', color: '#e8930c',
        what: 'A sliding power switch that cuts all power to the board. It lets you turn the project off cleanly without unplugging cables.',
        uses: ['Turning the board off without unplugging', 'Conserving battery in portable projects', 'Safe power cycling during development'],
        advantages: ['Simple and convenient', 'No software involved'],
        disadvantages: ['Physical part that can wear out', 'Only switches its own power rail'],
        examples: ['Powering down a battery sensor overnight', 'Cycling power during a demo without fumbling cables'],
      },
      {
        name: '3.3V REGULATOR', sub: 'Voltage reg', x: 8.35, z: -0.55, w: 0.5, d: 0.5, h: 0.25, col: 0x4a4a4a, lift: 2.0, group: 'right',
        icon: 'Sliders', color: '#0aa7c7',
        what: 'A low-dropout regulator that steps the 5V input down to a clean, stable 3.3V rail used by the microcontroller and the 3.3V pin.',
        uses: ['Converting 5V input to 3.3V', 'Supplying the 3.3V pin for sensors', 'Stable power for logic and radios'],
        advantages: ['Simple, stable 3.3V supply', 'No external part needed'],
        disadvantages: ['Gets warm under load', 'Limited current for external circuits'],
        examples: ['Powering a small OLED from the 3.3V pin', 'Keeping radio signals stable with clean power'],
      },
      {
        name: 'I2C HEADER', sub: 'SDA·SCL·3V3·GND', x: 8.35, z: 0.95, w: 0.45, d: 0.6, h: 0.3, col: 0x101010, lift: 2.4, group: 'right',
        icon: 'Binary', color: '#0aa7c7',
        what: 'A pin header exposing the I2C bus (SDA and SCL) plus power rails. I2C lets you chain many sensors and displays over just two signal wires.',
        uses: ['Connecting I2C sensors and displays', 'Chaining multiple modules on two wires', 'Powering low-current modules from the header'],
        advantages: ['Only two signal wires for many devices', 'Well-supported by sensor libraries'],
        disadvantages: ['Limited bus length and speed', 'Address conflicts between identical modules'],
        examples: ['Wiring an OLED display and a temperature sensor together', 'Reading an accelerometer over I2C'],
      },
      {
        name: 'SPI HEADER', sub: 'MOSI·MISO·SCK·CS', x: 8.35, z: 2.4, w: 0.45, d: 0.75, h: 0.3, col: 0x101010, lift: 2.8, group: 'right',
        icon: 'Binary', color: '#e8930c',
        what: 'A pin header exposing the SPI bus (MOSI, MISO, SCK and CS). SPI is a fast, full-duplex serial bus used for displays, SD cards and high-speed sensors.',
        uses: ['High-speed sensor and display links', 'Connecting microSD cards and flash chips', 'Full-duplex fast data transfer'],
        advantages: ['Much faster than I2C', 'Full-duplex simultaneous send/receive'],
        disadvantages: ['Needs four wires plus a chip-select per device', 'More complex wiring than I2C'],
        examples: ['Streaming data to a TFT display', 'Logging to a microSD card over SPI'],
      },

      {
        name: 'ETHERNET', sub: 'ENC28J60', x: -6.6, z: 3.9, w: 1.6, d: 1.4, h: 0.9, col: 0xb9b9b9, lift: 3.4, group: 'bottom', metalness: 0.7,
        icon: 'Network', color: '#0aa7c7',
        what: 'An ENC28J60 Ethernet module that adds a wired network connection to the board. Wired networking is stable, fast and free from Wi-Fi interference.',
        uses: ['Reliable wired internet for servers', 'Streaming sensor data without Wi-Fi drops', 'Remote access over the network'],
        advantages: ['Stable wired connection', 'No Wi-Fi configuration needed'],
        disadvantages: ['Requires a network cable', 'Adds a separate module'],
        examples: ['An MQTT broker handling data from many sensors', 'A wired dashboard streaming live IoT data'],
      },
      {
        name: 'MICRO SD SLOT', sub: '', x: -4.6, z: 3.9, w: 1.3, d: 1.3, h: 0.28, col: 0xcfcfcf, lift: 3.0, group: 'bottom', metalness: 0.6,
        icon: 'MemoryStick', color: '#e8930c',
        what: 'A microSD card slot for removable storage. It lets the board log data to a card — perfect for long-running sensor recordings that outlive RAM.',
        uses: ['Logging long-term sensor data', 'Storing configuration and firmware updates', 'Recording audio or image captures'],
        advantages: ['Cheap, removable storage', 'Huge capacity for logs'],
        disadvantages: ['Slow compared to built-in flash', 'Can corrupt if power is lost mid-write'],
        examples: ['A weather logger writing to a microSD card', 'Storing years of temperature readings'],
      },
      {
        name: '0.96" OLED', sub: 'I2C display', x: -2.5, z: 3.9, w: 1.5, d: 1.1, h: 0.35, col: 0x0a0a0a, lift: 3.8, group: 'bottom', emissive: 0x37e0b0, ei: 0.35,
        icon: 'Monitor', color: '#10b981',
        what: 'A tiny 0.96" OLED screen driven over I2C. It shows live values, graphs or status text right on the board without needing a computer.',
        uses: ['Displaying live sensor readings', 'Menus and status screens for devices', 'Battery-saving always-on displays'],
        advantages: ['Bright, high-contrast pixels', 'Two-wire I2C hookup'],
        disadvantages: ['Small 128x64 resolution', 'Draws extra power when always on'],
        examples: ['A desktop weather station display', 'Showing an air-quality score on a sensor node'],
      },
      {
        name: 'DHT22 SENSOR', sub: 'Temp / humidity', x: -0.3, z: 3.9, w: 1.1, d: 1.3, h: 0.6, col: 0x2d7dd2, lift: 3.2, group: 'bottom',
        icon: 'Gauge', color: '#3b82f6',
        what: 'The DHT22 measures temperature and humidity with good accuracy, reporting both over a single data wire. It is a workhorse of environmental monitoring.',
        uses: ['Measuring temperature and humidity', 'Weather stations and greenhouses', 'Comfort monitoring in rooms and offices'],
        advantages: ['Good accuracy (+/-0.5°C)', 'Single-wire data output', 'Cheap and widely available'],
        disadvantages: ['Slow sampling rate (max ~0.5Hz)', 'Timing-sensitive driver', 'Small drift over years'],
        examples: ['A room thermostat that logs comfort data', 'A greenhouse controller that waters when it is dry'],
      },
      {
        name: 'PIR MOTION', sub: 'Sensor', x: 1.9, z: 3.9, w: 1.2, d: 1.2, h: 0.7, col: 0xefefef, lift: 3.6, group: 'bottom',
        icon: 'Activity', color: '#e8930c',
        what: 'A passive infrared (PIR) motion sensor that detects movement by sensing changes in infrared heat. It outputs a HIGH pulse whenever something moves in front of it.',
        uses: ['Detecting motion for alarms', 'Automating lights when someone enters', 'Occupancy sensing in rooms'],
        advantages: ['No camera — privacy friendly', 'Cheap and easy to use', 'Very low power'],
        disadvantages: ['Only detects movement, not identity', 'Limited range and dead spots'],
        examples: ['A burglar alarm that triggers on movement', 'Automatic lights in a hallway'],
      },
      {
        name: 'RELAY 5V', sub: '', x: 4.1, z: 3.9, w: 1.3, d: 1.3, h: 0.7, col: 0x2255aa, lift: 3.0, group: 'bottom',
        icon: 'Zap', color: '#e63250',
        what: 'A 5V relay that lets a low-power board switch high-voltage mains or large DC loads on and off — the safe bridge between electronics and appliances.',
        uses: ['Switching household appliances', 'Controlling high-current DC motors', 'Isolating control circuits from power circuits'],
        advantages: ['Switches high power safely', 'Electrical isolation between circuits'],
        disadvantages: ['Mechanical parts can wear', 'Relatively slow switching', 'Needs a driver circuit to energize'],
        examples: ['Turning a lamp on from a phone app', 'A smart pump controller for irrigation'],
      },
      {
        name: 'POWER OUTPUT', sub: '5V·3.3V·GND', x: 6.4, z: 3.9, w: 1.1, d: 0.9, h: 0.4, col: 0x2e8b3d, lift: 2.6, group: 'bottom',
        icon: 'Zap', color: '#10b981',
        what: 'A terminal header that exposes regulated 5V, 3.3V and ground rails. It is the power hub for feeding external modules and breadboard circuits.',
        uses: ['Powering sensors and modules', 'Providing 5V and 3.3V for different logic levels', 'Grounding circuits for a shared reference'],
        advantages: ['Both regulated rails available', 'Convenient screw terminals'],
        disadvantages: ['Current limited by the onboard regulator', 'Not designed for heavy loads'],
        examples: ['Feeding a servo and sensor from the output rails', 'Powering a breadboard project from the board'],
      },
    ]

    const groupPush = {
      mcu: new THREE.Vector3(0, 0, -0.4),
      left: new THREE.Vector3(-1.1, 0, 0),
      right: new THREE.Vector3(1.1, 0, 0),
      bottom: new THREE.Vector3(0, 0, 0.5),
    }

    const pieces = []
    const footprintMat = new THREE.LineBasicMaterial({ color: 0x4fc0e8, transparent: true, opacity: 0.55 })
    const lineMat = new THREE.LineDashedMaterial({ color: 0x4fc0e8, dashSize: 0.16, gapSize: 0.1, transparent: true, opacity: 0.65 })

    comps.forEach((c) => {
      const radius = Math.min(c.w, c.d, c.h) * 0.16
      const geo = new RoundedBoxGeometry(c.w, c.h, c.d, 3, Math.min(radius, 0.09))
      const mat = new THREE.MeshStandardMaterial({
        color: c.col,
        roughness: c.roughness ?? 0.45,
        metalness: c.metalness ?? 0.35,
      })
      if (c.emissive) {
        mat.emissive = new THREE.Color(c.emissive)
        mat.emissiveIntensity = c.ei ?? 1
      }
      const mesh = new THREE.Mesh(geo, mat)
      const baseY = c.h / 2
      mesh.position.set(c.x, baseY, c.z)
      mesh.castShadow = true
      mesh.userData.name = c.name
      mesh.userData.sub = c.sub
      mesh.userData.data = c
      boardGroup.add(mesh)

      const fw = c.w * 0.92
      const fd = c.d * 0.92
      const pts = [
        new THREE.Vector3(-fw / 2, 0.01, -fd / 2),
        new THREE.Vector3(fw / 2, 0.01, -fd / 2),
        new THREE.Vector3(fw / 2, 0.01, fd / 2),
        new THREE.Vector3(-fw / 2, 0.01, fd / 2),
        new THREE.Vector3(-fw / 2, 0.01, -fd / 2),
      ]
      const fgeo = new THREE.BufferGeometry().setFromPoints(pts)
      const floop = new THREE.Line(fgeo, footprintMat)
      floop.position.set(c.x, 0, c.z)
      boardGroup.add(floop)

      const push = groupPush[c.group]
      const exX = c.x + push.x
      const exZ = c.z + push.z
      const exY = baseY + c.lift

      const lgeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(c.x, 0, c.z), mesh.position.clone()])
      const line = new THREE.Line(lgeo, lineMat)
      line.computeLineDistances()
      boardGroup.add(line)

      const label = makeLabel(c.name)
      label.position.copy(mesh.position)
      boardGroup.add(label)

      pieces.push({
        mesh,
        line,
        label,
        base: new THREE.Vector3(c.x, baseY, c.z),
        exploded: new THREE.Vector3(exX, exY, exZ),
        footX: c.x,
        footZ: c.z,
        halfH: c.h / 2,
        labelGap: 0.62,
      })
    })

    // ---------- raycasting for hover ----------
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const meshes = pieces.map((p) => p.mesh)
    let progress = 0
    let targetProgress = 0
    let pinned = false

    const onCanvasMove = (e) => {
      const rect = holder.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects([pcb, ...meshes])
      if (hits.length) {
        const m = hits[0].object
        if (!pinned) targetProgress = 1
        if (m.userData.name) {
          tooltip.style.opacity = 1
          tooltip.style.left = `${e.clientX - rect.left}px`
          tooltip.style.top = `${e.clientY - rect.top}px`
          tooltip.innerHTML = m.userData.name + (m.userData.sub ? `<span class="sub">${m.userData.sub}</span>` : '')
        } else {
          tooltip.style.opacity = 0
        }
        holder.style.cursor = 'pointer'
      } else {
        if (!pinned) targetProgress = 0
        tooltip.style.opacity = 0
        holder.style.cursor = 'default'
      }
    }
    holder.addEventListener('pointermove', onCanvasMove)

    const onPointerLeave = () => {
      if (pinned) return
      targetProgress = 0
      tooltip.style.opacity = 0
      holder.style.cursor = 'default'
    }
    holder.addEventListener('pointerleave', onPointerLeave)

    const onClick = (e) => {
      const rect = holder.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects([pcb, ...meshes])
      if (!hits.length) return
      const hitObj = hits[0].object
      if (hitObj === pcb) {
        pinned = !pinned
        if (pinned) targetProgress = targetProgress > 0.5 ? 0 : 1
        return
      }
      const comp = hitObj.userData.data
      if (comp) setPart(comp)
    }
    holder.addEventListener('click', onClick)

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    const hintTimer = setTimeout(() => hintEl.classList.add('show'), 2600)

    // ---------- render loop ----------
    const clock = new THREE.Clock()
    const animSpeed = 0.9
    let rafId = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const dt = clock.getDelta()

      // gentle idle orbit so the board always feels alive
      if (!dragging) {
        theta += dt * 0.12
        updateCamera()
      }

      // slow floating bob of the whole board
      boardGroup.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.08

      if (Math.abs(progress - targetProgress) > 0.0005) {
        const dir = targetProgress > progress ? 1 : -1
        progress += dir * animSpeed * dt
        progress = Math.max(0, Math.min(1, progress))
      }

      const eased = easeInOutCubic(progress)

      pieces.forEach((p, idx) => {
        p.mesh.position.lerpVectors(p.base, p.exploded, eased)
        p.mesh.rotation.y = eased * 0.06 * (idx % 2 === 0 ? 1 : -1)
        p.label.position.set(p.mesh.position.x, p.mesh.position.y + p.halfH + p.labelGap, p.mesh.position.z)
        p.label.material.opacity = 1

        const linePts = p.line.geometry.attributes.position.array
        linePts[0] = p.footX
        linePts[1] = 0.01
        linePts[2] = p.footZ
        linePts[3] = p.mesh.position.x
        linePts[4] = p.mesh.position.y - p.halfH
        linePts[5] = p.mesh.position.z
        p.line.geometry.attributes.position.needsUpdate = true
        p.line.computeLineDistances()
        p.line.material.opacity = eased * 0.7
        p.line.material.dashOffset -= dt * 0.6
      })

      composer.render()
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(hintTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      holder.removeEventListener('pointerdown', onPointerDown)
      holder.removeEventListener('pointermove', onCanvasMove)
      holder.removeEventListener('pointerleave', onPointerLeave)
      holder.removeEventListener('click', onClick)
      ro.disconnect()
      composer.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="exploded-stage">
      <div className="exploded-canvas-holder" ref={holderRef} />

      <div className="exploded-tooltip" ref={tooltipRef} />

      <div className="exploded-hint" ref={hintRef}>
        hover the board to <b>disassemble</b> · click a part for <b>details</b> · click the board to <b>pin</b> · drag to <b>rotate</b>
      </div>

      {part && <PartInfoCard part={part} onClose={() => setPart(null)} />}
    </div>
  )
}
