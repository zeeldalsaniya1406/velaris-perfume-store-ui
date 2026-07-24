import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as productApi from '../../api/productApi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/format'
import BottleIllustration from '../../components/BottleIllustration'

function playSpraySound(audioCtxRef, muted) {
  if (muted) return
  try {
    const ctx = audioCtxRef.current || new AudioContext()
    audioCtxRef.current = ctx
    const dur = 0.28
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filt = ctx.createBiquadFilter()
    filt.type = 'bandpass'
    filt.frequency.value = 4200
    filt.Q.value = 0.7
    const gain = ctx.createGain()
    gain.gain.value = 0.22
    src.connect(filt)
    filt.connect(gain)
    gain.connect(ctx.destination)
    src.start()
  } catch (_) {}
}

function sprayParticles(btnRef) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const btn = btnRef.current
  if (!btn) return
  const r = btn.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    const size = 3 + Math.random() * 7
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.8
    const dist = 35 + Math.random() * 85
    p.style.cssText = [
      'position:fixed',
      'border-radius:50%',
      'pointer-events:none',
      `width:${size}px`,
      `height:${size}px`,
      'background:var(--gold)',
      'opacity:0.55',
      `left:${cx}px`,
      `top:${cy}px`,
      'z-index:9999',
    ].join(';')
    document.body.appendChild(p)
    p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 0.55 },
        {
          transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px) scale(0.2)`,
          opacity: 0,
        },
      ],
      { duration: 700 + Math.random() * 500, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => p.remove()
  }
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState({ type: null, message: '' })
  const [soundMuted, setSoundMuted] = useState(false)

  const audioCtxRef = useRef(null)
  const addBtnRef = useRef(null)

  useEffect(() => {
    productApi.getProduct(id).then(setProduct)
  }, [id])

  if (!product) return <div className="page-loading">Loading...</div>

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price
  const outOfStock = product.stock <= 0

  async function handleAddToCart() {
    playSpraySound(audioCtxRef, soundMuted)
    sprayParticles(addBtnRef)
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } })
      return
    }
    setStatus({ type: null, message: '' })
    try {
      await addItem(product.id, quantity)
      setStatus({ type: 'success', message: 'Added to cart' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <BottleIllustration
          color={product.bottleColor || '#C9A84C'}
          label={product.name}
          sublabel={product.brand}
        />
      </div>

      <div className="product-detail-info">
        <p className="product-detail-eyebrow">{product.brand}</p>
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-meta">
          {product.categoryName} &middot; {product.volumeMl}ml &middot;{' '}
          {product.gender.charAt(0) + product.gender.slice(1).toLowerCase()}
        </p>

        <div className="product-detail-divider" />

        <div className="detail-price-block">
          <span className="detail-price-current">
            {formatCurrency(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span className="detail-price-original">{formatCurrency(product.price)}</span>
          )}
        </div>

        <p className="product-detail-description">{product.description}</p>

        {outOfStock ? (
          <p className="badge badge-out">Out of stock</p>
        ) : (
          <>
            <div className="product-detail-actions">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))
                }
                className="qty-input"
              />
              <button ref={addBtnRef} className="btn btn-add-to-bag" onClick={handleAddToCart}>
                Add to Bag
              </button>
              <button
                className="spray-mute-btn"
                onClick={() => setSoundMuted((v) => !v)}
                title={soundMuted ? 'Unmute spray sound' : 'Mute spray sound'}
              >
                {soundMuted ? 'Sound off' : 'Sound on'}
              </button>
            </div>
            <p className="product-detail-stock">{product.stock} in stock</p>
          </>
        )}

        {status.message && (
          <p className={status.type === 'error' ? 'error' : 'success'}>{status.message}</p>
        )}
      </div>
    </div>
  )
}
