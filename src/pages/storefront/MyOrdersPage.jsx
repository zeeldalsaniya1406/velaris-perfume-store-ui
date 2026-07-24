import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as orderApi from '../../api/orderApi'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    orderApi.getMyOrders().then(setOrders)
  }, [])

  if (!orders) return <div className="page-loading">Loading...</div>

  if (orders.length === 0) {
    return (
      <div className="empty-cart">
        <h2>No orders yet</h2>
        <Link to="/products" className="btn">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="order-list">
        {orders.map((order) => (
          <Link key={order.id} to={`/my-orders/${order.id}`} className="order-list-item">
            <div>
              <p className="order-number">{order.orderNumber}</p>
              <p className="order-date">{formatDate(order.createdAt)}</p>
            </div>
            <p>{order.items.length} item(s)</p>
            <p>{formatCurrency(order.totalAmount)}</p>
            <OrderStatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  )
}
