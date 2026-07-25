import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import velarisMark from '../../assets/velaris-logo-mark.png'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/messages', label: 'Messages' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <img src={velarisMark} alt="Velaris" className="admin-brand-logo" />
          <span>Admin</span>
        </Link>

        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="admin-nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-user">{user?.name}</p>
          <Link to="/" className="admin-nav-link">
            View storefront
          </Link>
          <button className="link-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
