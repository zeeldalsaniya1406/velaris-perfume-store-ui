import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import * as adminApi from '../../api/adminApi'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'

const CATEGORICAL = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948']

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target)) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return undefined
    }

    let frame
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

function StatTile({ label, value, formatter }) {
  const isNumeric = typeof value === 'number'
  const animated = useCountUp(isNumeric ? value : null)
  const display = isNumeric
    ? formatter
      ? formatter(Math.round(animated))
      : Math.round(animated).toLocaleString('en-IN')
    : value

  return (
    <div className="stat-tile">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{display}</p>
    </div>
  )
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="chart-tooltip-value">
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    adminApi.getDashboardSummary().then(setSummary)
  }, [])

  if (!summary) return <div className="page-loading">Loading...</div>

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="stat-grid">
        <StatTile label="Total Revenue" value={Number(summary.totalRevenue)} formatter={formatCurrency} />
        <StatTile label="Last 30 Days" value={Number(summary.last30DaysRevenue)} formatter={formatCurrency} />
        <StatTile label="Total Orders" value={summary.totalOrders} />
        <StatTile label="Pending Orders" value={summary.pendingOrders} />
        <StatTile label="Total Users" value={summary.totalUsers} />
        <StatTile label="Active Products" value={summary.totalProducts} />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h2>Monthly Revenue</h2>
          {summary.monthlyRevenue.length === 0 ? (
            <p className="empty-state">No revenue data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={summary.monthlyRevenue} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#e1e0d9" vertical={false} />
                <XAxis dataKey="month" stroke="#898781" tickLine={false} axisLine={{ stroke: '#c3c2b7' }} />
                <YAxis stroke="#898781" tickLine={false} axisLine={false} width={80}
                  tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<ChartTooltip formatter={formatCurrency} />} />
                <Line type="monotone" dataKey="revenue" stroke="#2a78d6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>Revenue by Category</h2>
          {summary.revenueByCategory.length === 0 ? (
            <p className="empty-state">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={summary.revenueByCategory} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#e1e0d9" vertical={false} />
                <XAxis dataKey="category" stroke="#898781" tickLine={false} axisLine={{ stroke: '#c3c2b7' }} />
                <YAxis stroke="#898781" tickLine={false} axisLine={false} width={80}
                  tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<ChartTooltip formatter={formatCurrency} />} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {summary.revenueByCategory.map((entry, i) => (
                    <Cell key={entry.category} fill={CATEGORICAL[i % CATEGORICAL.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <div className="chart-card">
          <h2>Top Selling Products</h2>
          {summary.topSellingProducts.length === 0 ? (
            <p className="empty-state">No sales yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {summary.topSellingProducts.map((p) => (
                  <tr key={p.productName}>
                    <td>{p.productName}</td>
                    <td>{p.quantitySold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="section-link">
              View all &rarr;
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                    <div className="muted-text">{formatDate(order.createdAt)}</div>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
