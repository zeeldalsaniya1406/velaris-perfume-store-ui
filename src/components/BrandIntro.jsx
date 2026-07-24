import { useEffect, useState } from 'react'
import velarisMark from '../assets/velaris-logo-mark.png'

export default function BrandIntro() {
  const [phase, setPhase] = useState('in') // 'in' | 'fading' | 'done'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fadeTimer = setTimeout(() => setPhase('fading'), 2600)
    return () => clearTimeout(fadeTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'fading') return
    const doneTimer = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = ''
    }, 900)
    return () => clearTimeout(doneTimer)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div className={`brand-intro${phase === 'fading' ? ' brand-intro--out' : ''}`}>
      <div className="brand-intro-content">
        <img src={velarisMark} alt="Velaris" className="brand-intro-logo" />
        <div className="brand-intro-mask">
          <span className="brand-intro-tag">· Luxury Fragrances ·</span>
        </div>
      </div>
    </div>
  )
}
