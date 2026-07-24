import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as bannerApi from '../../api/bannerApi'
import * as categoryApi from '../../api/categoryApi'
import * as productApi from '../../api/productApi'
import BannerCarousel from '../../components/BannerCarousel'
import CategoryCard from '../../components/CategoryCard'
import ProductCard from '../../components/ProductCard'

export default function HomePage() {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      bannerApi.getActiveBanners(),
      categoryApi.getCategories(),
      productApi.searchProducts({ size: 8, sortBy: 'createdAt', direction: 'desc' }),
    ])
      .then(([bannerData, categoryData, productData]) => {
        setBanners(bannerData)
        setCategories(categoryData)
        setFeatured(productData.content)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loading">Loading...</div>

  return (
    <div className="home-page">
      <BannerCarousel banners={banners} />

      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <Link to="/products" className="section-link">
            View all &rarr;
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
