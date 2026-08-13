import { useEffect, useState } from 'react'
import {
  X,
  Check,
  Minus,
  Rocket,
  HelpCircle,
} from 'lucide-react'

import { iconMap } from '../data/iconMap.js'


/* =========================================================
   LIST COMPONENT
========================================================= */

function List({ items = [], icon: Icon, color }) {
  if (!items?.length) return null

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,

        width: '100%',
        maxWidth: '100%',
        minWidth: 0,

        display: 'flex',
        flexDirection: 'column',
        gap: '14px',

        boxSizing: 'border-box',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',

            gap: '11px',

            width: '100%',
            maxWidth: '100%',
            minWidth: 0,

            fontSize: '15px',
            lineHeight: '1.55',

            color: '#29465f',

            boxSizing: 'border-box',

            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          <Icon
            size={15}
            strokeWidth={2}
            style={{
              flexShrink: 0,
              marginTop: '4px',
              color,
            }}
          />

          <span
            style={{
              flex: 1,

              minWidth: 0,
              maxWidth: '100%',

              whiteSpace: 'normal',

              overflowWrap: 'anywhere',
              wordBreak: 'break-word',

              boxSizing: 'border-box',
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PartInfoCard({ part, onClose }) {

  const Icon = iconMap[part?.icon] || HelpCircle

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth <= 700
      : false
  )


  /* =======================================================
     EFFECTS
  ======================================================= */

  useEffect(() => {

    if (!part) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700)
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    window.addEventListener(
      'resize',
      handleResize
    )

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )

      window.removeEventListener(
        'resize',
        handleResize
      )

      document.body.style.overflow =
        previousOverflow
    }

  }, [part, onClose])


  /* =======================================================
     NO PART
  ======================================================= */

  if (!part) return null


  /* =======================================================
     COLORS
  ======================================================= */

  const partColor =
    part.color || '#06b6d4'


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>

      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        onClick={onClose}
        style={{
          position: 'fixed',

          inset: 0,

          width: '100vw',
          height: '100vh',

          zIndex: 99999,

          display: 'flex',

          justifyContent: 'flex-end',

          alignItems: 'stretch',

          margin: 0,
          padding: 0,

          background:
            'rgba(20, 35, 50, 0.48)',

          backdropFilter:
            'blur(7px)',

          WebkitBackdropFilter:
            'blur(7px)',

          boxSizing: 'border-box',

          overflow: 'hidden',
        }}
      >

        {/* =================================================
            RIGHT SIDE MODAL
        ================================================= */}

        <div
          role="dialog"
          aria-modal="true"
          aria-label={part.name}

          onClick={(e) =>
            e.stopPropagation()
          }

          style={{
            position: 'relative',

            width: isMobile
              ? '100vw'
              : '48vw',

            maxWidth: isMobile
              ? '100vw'
              : '760px',

            minWidth: isMobile
              ? '0'
              : '560px',

            height: '100vh',

            flexShrink: 0,

            display: 'flex',

            flexDirection: 'column',

            background: '#ffffff',

            borderRadius: isMobile
              ? '22px 0 0 22px'
              : '30px 0 0 30px',

            overflow: 'hidden',

            boxShadow:
              '-20px 0 60px rgba(0, 0, 0, 0.20)',

            margin: 0,
            padding: 0,

            boxSizing: 'border-box',

            animation:
              'partModalSlide 0.28s ease-out',
          }}
        >

          {/* =================================================
              TOP GRADIENT
          ================================================= */}

          <div
            style={{
              position: 'absolute',

              top: 0,
              left: 0,
              right: 0,

              height: '3px',

              background:
                'linear-gradient(90deg, #06b6d4, #ec4899)',

              zIndex: 10,

              pointerEvents: 'none',
            }}
          />


          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              position: 'relative',

              width: '100%',
              maxWidth: '100%',
              minWidth: 0,

              display: 'flex',

              alignItems: 'center',

              gap: '20px',

              padding: isMobile
                ? '32px 70px 25px 25px'
                : '42px 85px 32px 44px',

              minHeight: isMobile
                ? '115px'
                : '145px',

              flexShrink: 0,

              background: '#ffffff',

              borderBottom:
                '1px solid #dceaf0',

              boxSizing: 'border-box',

              overflow: 'hidden',
            }}
          >

            {/* =============================================
                ICON
            ============================================= */}

            <div
              style={{
                width: isMobile
                  ? '62px'
                  : '84px',

                height: isMobile
                  ? '62px'
                  : '84px',

                flexShrink: 0,

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                borderRadius: '18px',

                color: partColor,

                background:
                  `${partColor}0D`,

                border:
                  `1px solid ${partColor}55`,

                boxShadow:
                  `0 8px 25px ${partColor}18`,

                boxSizing: 'border-box',
              }}
            >

              <Icon
                size={
                  isMobile
                    ? 24
                    : 30
                }

                strokeWidth={1.8}
              />

            </div>


            {/* =============================================
                TITLE
            ============================================= */}

            <div
              style={{
                minWidth: 0,
                maxWidth: '100%',

                flex: 1,

                overflow: 'hidden',
              }}
            >

              <span
                style={{
                  display: 'block',

                  marginBottom: '7px',

                  fontSize: isMobile
                    ? '10px'
                    : '13px',

                  fontWeight: 800,

                  letterSpacing: '2.8px',

                  textTransform: 'uppercase',

                  color: '#079db9',

                  whiteSpace: 'nowrap',
                }}
              >
                Component Details
              </span>


              <h3
                style={{
                  margin: 0,

                  padding: 0,

                  fontSize: isMobile
                    ? '23px'
                    : '30px',

                  lineHeight: 1.2,

                  fontWeight: 800,

                  color: '#102a43',

                  maxWidth: '100%',

                  whiteSpace: 'normal',

                  overflowWrap: 'anywhere',

                  wordBreak: 'break-word',
                }}
              >
                {part.name}
              </h3>

            </div>


            {/* =============================================
                CLOSE BUTTON
            ============================================= */}

            <button
              type="button"

              onClick={onClose}

              aria-label="Close details"

              style={{
                position: 'absolute',

                top: isMobile
                  ? '18px'
                  : '25px',

                right: isMobile
                  ? '18px'
                  : '25px',

                width: isMobile
                  ? '44px'
                  : '55px',

                height: isMobile
                  ? '44px'
                  : '55px',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                padding: 0,

                borderRadius: '50%',

                border:
                  '1px solid #b8e5ef',

                background:
                  '#f0fcff',

                color: '#27485f',

                cursor: 'pointer',

                boxSizing: 'border-box',

                flexShrink: 0,
              }}
            >

              <X
                size={
                  isMobile
                    ? 20
                    : 24
                }

                strokeWidth={1.8}
              />

            </button>

          </div>


          {/* =================================================
              BODY
          ================================================= */}

          <div
            style={{
              flex: 1,

              minHeight: 0,

              minWidth: 0,

              width: '100%',

              maxWidth: '100%',

              overflowY: 'auto',

              overflowX: 'hidden',

              padding: isMobile
                ? '25px 22px 40px'
                : '38px 44px 50px',

              display: 'flex',

              flexDirection: 'column',

              gap: isMobile
                ? '24px'
                : '30px',

              boxSizing: 'border-box',

              scrollbarWidth: 'thin',

              scrollbarColor:
                '#8dd7e5 transparent',
            }}
          >


            {/* =================================================
                WHAT IS IT
            ================================================= */}

            <section
              style={{
                width: '100%',

                maxWidth: '100%',

                minWidth: 0,

                boxSizing: 'border-box',
              }}
            >

              <h4
                style={{
                  display: 'flex',

                  alignItems: 'center',

                  gap: '9px',

                  margin:
                    '0 0 13px',

                  padding: 0,

                  fontSize: '17px',

                  lineHeight: 1.3,

                  fontWeight: 800,

                  color: '#102a43',
                }}
              >

                <HelpCircle
                  size={17}
                  style={{
                    color: '#06b6d4',

                    flexShrink: 0,
                  }}
                />

                <span>
                  What is it?
                </span>

              </h4>


              <p
                style={{
                  margin: 0,

                  padding: 0,

                  width: '100%',

                  maxWidth: '100%',

                  minWidth: 0,

                  fontSize: '16px',

                  lineHeight: '1.7',

                  color: '#29465f',

                  whiteSpace: 'normal',

                  overflowWrap:
                    'anywhere',

                  wordBreak:
                    'break-word',

                  boxSizing:
                    'border-box',
                }}
              >
                {part.what}
              </p>

            </section>


            {/* =================================================
                USES
            ================================================= */}

            <section
              style={{
                width: '100%',

                maxWidth: '100%',

                minWidth: 0,

                boxSizing:
                  'border-box',
              }}
            >

              <h4
                style={{
                  display: 'flex',

                  alignItems: 'center',

                  gap: '9px',

                  margin:
                    '0 0 15px',

                  padding: 0,

                  fontSize: '17px',

                  lineHeight: 1.3,

                  fontWeight: 800,

                  color: '#102a43',
                }}
              >

                <Check
                  size={17}
                  style={{
                    color: '#06b6d4',

                    flexShrink: 0,
                  }}
                />

                <span>
                  Uses
                </span>

              </h4>


              <List
                items={part.uses}
                icon={Check}
                color="#06b6d4"
              />

            </section>


            {/* =================================================
                ADVANTAGES / DISADVANTAGES
            ================================================= */}

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  isMobile
                    ? '1fr'
                    : 'minmax(0, 1fr) minmax(0, 1fr)',

                gap: isMobile
                  ? '25px'
                  : '38px',

                alignItems: 'start',

                width: '100%',

                maxWidth: '100%',

                minWidth: 0,

                boxSizing:
                  'border-box',
              }}
            >

              {/* =============================================
                  ADVANTAGES
              ============================================= */}

              <section
                style={{
                  width: '100%',

                  maxWidth: '100%',

                  minWidth: 0,

                  boxSizing:
                    'border-box',
                }}
              >

                <h4
                  style={{
                    display: 'flex',

                    alignItems: 'center',

                    gap: '9px',

                    margin:
                      '0 0 15px',

                    fontSize: '17px',

                    lineHeight: 1.3,

                    fontWeight: 800,

                    color: '#102a43',
                  }}
                >

                  <Check
                    size={17}
                    style={{
                      color: '#06b6d4',

                      flexShrink: 0,
                    }}
                  />

                  <span>
                    Advantages
                  </span>

                </h4>


                <List
                  items={part.advantages}
                  icon={Check}
                  color="#10b981"
                />

              </section>


              {/* =============================================
                  DISADVANTAGES
              ============================================= */}

              <section
                style={{
                  width: '100%',

                  maxWidth: '100%',

                  minWidth: 0,

                  boxSizing:
                    'border-box',
                }}
              >

                <h4
                  style={{
                    display: 'flex',

                    alignItems: 'center',

                    gap: '9px',

                    margin:
                      '0 0 15px',

                    fontSize: '17px',

                    lineHeight: 1.3,

                    fontWeight: 800,

                    color: '#102a43',
                  }}
                >

                  <Minus
                    size={17}
                    style={{
                      color: '#ec4899',

                      flexShrink: 0,
                    }}
                  />

                  <span>
                    Disadvantages
                  </span>

                </h4>


                <List
                  items={
                    part.disadvantages
                  }
                  icon={Minus}
                  color="#ec4899"
                />

              </section>

            </div>


            {/* =================================================
                EXAMPLE USE CASES
            ================================================= */}

            {part.examples?.length > 0 && (

              <section
                style={{
                  width: '100%',

                  maxWidth: '100%',

                  minWidth: 0,

                  padding: isMobile
                    ? '20px'
                    : '24px',

                  borderRadius: '17px',

                  background:
                    '#faf8ff',

                  border:
                    '1px solid #e6ddff',

                  boxSizing:
                    'border-box',

                  overflow:
                    'hidden',
                }}
              >

                <h4
                  style={{
                    display: 'flex',

                    alignItems: 'center',

                    gap: '9px',

                    margin:
                      '0 0 15px',

                    fontSize: '17px',

                    lineHeight: 1.3,

                    fontWeight: 800,

                    color: '#7c3aed',
                  }}
                >

                  <Rocket
                    size={17}
                    style={{
                      color: '#8b5cf6',

                      flexShrink: 0,
                    }}
                  />

                  <span>
                    Example Use Cases
                  </span>

                </h4>


                <List
                  items={part.examples}
                  icon={Rocket}
                  color="#8b5cf6"
                />

              </section>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          MODAL ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes partModalSlide {
            from {
              transform: translateX(100%);
            }

            to {
              transform: translateX(0);
            }
          }

          @media (max-width: 700px) {
            body {
              overflow-x: hidden !important;
            }
          }
        `}
      </style>

    </>
  )
}