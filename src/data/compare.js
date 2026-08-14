export const compareBoards = [
  {
    id: 'arduino',
    name: 'Arduino',
    color: '#0aa7bd',
    blurb: 'Beginner-friendly microcontroller',
  },
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi',
    color: '#4ade80',
    blurb: 'Full Linux computer',
  },
  {
    id: 'esp32',
    name: 'ESP32',
    color: '#e8930c',
    blurb: 'Wi-Fi + Bluetooth MCU',
  },
  {
    id: 'stm32',
    name: 'STM32',
    color: '#0aa7c7',
    blurb: 'Professional Cortex-M MCU',
  },
  {
    id: 'beaglebone',
    name: 'BeagleBone',
    color: '#e63250',
    blurb: 'Linux + real-time PRU',
  },
]

export const compareRows = [
  {
    label: 'Processor',
    values: [
      'ATmega328P · 8-bit · 16 MHz',
      'BCM2711 · 4× Cortex-A72 · 1.5 GHz',
      'ESP32 · 2× Xtensa LX6 · 240 MHz',
      'STM32F103 · Cortex-M3 · 72 MHz',
      'AM335x · Cortex-A8 · 1 GHz',
    ],
  },
  {
    label: 'GPIO',
    values: [
      '14 digital + 6 analog',
      '40-pin header',
      '34 pins',
      '37 pins',
      '65 pins (2 × 46)',
    ],
  },
  {
    label: 'Connectivity',
    values: [
      'USB · Serial',
      'Ethernet · Wi-Fi · BT 5.0',
      'Wi-Fi 802.11 b/g/n · BLE',
      'USB · CAN · I2C/SPI/UART',
      'Ethernet · USB · HDMI',
    ],
  },
  {
    label: 'Operating System',
    values: [
      'None — bare metal',
      'Linux (Raspberry Pi OS)',
      'FreeRTOS / Arduino / MicroPython',
      'RTOS / bare metal',
      'Linux (Debian)',
    ],
  },
  {
    label: 'Power Usage',
    values: [
      '~0.3 W',
      '3–5 W',
      '~0.3 W',
      '~0.1 W',
      '2–5 W',
    ],
  },
  {
    label: 'Difficulty',
    values: ['Beginner', 'Intermediate', 'Intermediate', 'Advanced', 'Advanced'],
  },
  {
    label: 'Best For',
    values: [
      'Education, hobby breadboard projects',
      'Desktops, servers, media, AI',
      'IoT sensors, wearables, Wi-Fi',
      'Motor control, industrial',
      'Robotics, real-time + Linux',
    ],
  },
]
