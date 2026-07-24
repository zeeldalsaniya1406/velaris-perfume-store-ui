import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransitionCurtain() {
  const location = useLocation()
  const curtainRef = useRef(null)
  const prevPath = useRef(location.pathname)
  const animating = useRef(false)

  useEffect(() => {
    if (prevPath.current === location.pathname || animating.current) return
    prevPath.current = location.pathname

    const el = curtainRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    animating.current = true
    el.style.display = 'block'
    el.style.transformOrigin = 'left'

    el.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 380, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' }
    ).onfinish = () => {
      el.style.transformOrigin = 'right'
      el.animate(
        [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
        { duration: 380, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' }
      ).onfinish = () => {
        el.style.display = 'none'
        animating.current = false
      }
    }
  }, [location.pathname])

  return <div ref={curtainRef} className="page-curtain" aria-hidden="true" />
}
