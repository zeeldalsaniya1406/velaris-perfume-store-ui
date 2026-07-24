import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?categoryId=${category.id}`} className="category-card">
      <img src={category.imageUrl} alt={category.name} loading="lazy" />
      <div className="category-card-label">
        <h3>{category.name}</h3>
      </div>
    </Link>
  )
}
