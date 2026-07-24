import { useEffect, useRef, useState } from 'react'

export default function GrainOverlay() {
  const canvasRef = useRef(null)
  const timerRef = useRef(null)
  const [on, setOn] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 200
    canvas.height = 160

    function draw() {
      const img = ctx.createImageData(200, 160)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }

    if (on) {
      draw()
      timerRef.current = setInterval(draw, 110)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [on])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="grain-canvas"
        style={{ opacity: on ? 0.065 : 0 }}
        aria-hidden="true"
      />
      <button
        className="grain-toggle"
        onClick={() => setOn((v) => !v)}
        title={on ? 'Turn off film grain' : 'Turn on film grain'}
      >
        {on ? 'Grain: on' : 'Grain: off'}
      </button>
    </>
  )
}
