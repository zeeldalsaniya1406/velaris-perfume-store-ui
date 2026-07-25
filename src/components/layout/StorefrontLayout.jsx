import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import BrandIntro from '../BrandIntro'
import velarisMark from '../../assets/velaris-logo-mark.png'

export default function StorefrontLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { cart } = useCart()

  return (
    <div className="storefront">
      <BrandIntro />
      <header className="storefront-header">
        <div className="storefront-header-inner">
          <Link to="/" className="brand">
            <img src={velarisMark} alt="Velaris" className="brand-logo-img" />
            <span className="brand-sub">
              <span className="brand-sub-dot" />
              Luxury Fragrances
            </span>
          </Link>

          <nav className="storefront-nav">
            <NavLink to="/products" className="nav-link">
              Shop
            </NavLink>
            <NavLink to="/products?categoryId=1" className="nav-link">
              For Him
            </NavLink>
            <NavLink to="/products?categoryId=2" className="nav-link">
              For Her
            </NavLink>
            <NavLink to="/products?categoryId=4" className="nav-link">
              Gift Sets
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              Contact
            </NavLink>
          </nav>

          <div className="storefront-actions">
            <Link to="/cart" className="cart-link">
              Cart
              {cart.totalItems > 0 && <span className="cart-badge">{cart.totalItems}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                <Link to="/my-orders" className="nav-link">
                  My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">
                    Admin
                  </Link>
                )}
                <button className="link-button" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="user-menu">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-small">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="storefront-main">
        <Outlet />
      </main>

      <footer className="storefront-footer">
        <p>Velaris &mdash; Luxury Fragrances</p>
        <Link to="/contact" className="footer-link">
          Contact Us
        </Link>
      </footer>
    </div>
  )
}
