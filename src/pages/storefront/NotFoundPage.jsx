import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="empty-cart">
      <h2>Page not found</h2>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </div>
  )
}
