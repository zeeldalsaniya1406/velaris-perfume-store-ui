import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

function spawnScentParticles(e) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const card = e.currentTarget
  const bottle = card.querySelector('.mini-bottle')
  if (!bottle) return

  const cardRect = card.getBoundingClientRect()
  const bottleRect = bottle.getBoundingClientRect()
  const topY = bottleRect.top - cardRect.top
  const centerX = bottleRect.left - cardRect.left + bottleRect.width / 2

  for (let i = 0; i < 7; i++) {
    const p = document.createElement('div')
    const size = 4 + Math.random() * 7
    const startX = centerX + (Math.random() - 0.5) * bottleRect.width * 0.8
    p.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'pointer-events:none',
      'z-index:5',
      `width:${size}px`,
      `height:${size}px`,
      'background:var(--gold)',
      'opacity:0.65',
      `left:${startX}px`,
      `top:${topY}px`,
    ].join(';')
    card.appendChild(p)
    p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 0.65 },
        { transform: `translate(${(Math.random() - 0.5) * 40}px,-65px) scale(0.2)`, opacity: 0 },
      ],
      { duration: 1400 + Math.random() * 900, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => p.remove()
  }
}

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price
  const outOfStock = product.stock <= 0
  const fillColor = product.bottleColor || '#C9A84C'

  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card"
      onMouseEnter={spawnScentParticles}
    >
      <div className="mini-bottle" aria-hidden="true">
        <div className="mb-cap" />
        <div className="mb-body">
          <div className="mb-fill" style={{ background: fillColor }} />
        </div>
      </div>

      {hasDiscount && <span className="badge badge-sale" style={{ marginBottom: '10px', display: 'inline-block' }}>Sale</span>}
      {outOfStock && <span className="badge badge-out" style={{ marginBottom: '10px', display: 'inline-block' }}>Out of stock</span>}

      <p className="product-family">{product.categoryName}</p>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-brand">{product.brand}</p>
      <p className="product-card-desc">{product.description}</p>

      <div className="product-price">
        {hasDiscount ? (
          <>
            <span className="price-current">
              {formatCurrency(product.discountPrice)} &middot; {product.volumeMl}ml
            </span>
            <span className="price-original">{formatCurrency(product.price)}</span>
          </>
        ) : (
          <span className="price-current">
            {formatCurrency(product.price)} &middot; {product.volumeMl}ml
          </span>
        )}
      </div>

      <span className="product-discover">View details</span>
    </Link>
  )
}
