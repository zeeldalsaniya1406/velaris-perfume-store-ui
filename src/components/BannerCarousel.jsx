import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) return null

  const banner = banners[index]

  return (
    <div className="banner-carousel">
      <Link key={banner.id} to={banner.linkUrl || '/products'} className="banner-slide">
        <img src={banner.imageUrl} alt={banner.title} />
        <div className="banner-overlay">
          <h2>{banner.title}</h2>
          {banner.subtitle && <p>{banner.subtitle}</p>}
        </div>
      </Link>

      {banners.length > 1 && (
        <div className="banner-dots">
          {banners.map((b, i) => (
            <button
              key={b.id}
              className={`banner-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
