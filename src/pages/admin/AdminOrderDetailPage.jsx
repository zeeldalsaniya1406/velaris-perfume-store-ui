import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as orderApi from '../../api/orderApi'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import { PaymentMethodIcon, paymentMethodLabel } from '../../components/PaymentMethodIcon'
import { formatCurrency, formatDate } from '../../utils/format'

const NEXT_STATUS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    orderApi.getAdminOrder(id).then(setOrder)
  }, [id])

  async function handleStatusChange(status) {
    setError('')
    setUpdating(true)
    try {
      const updated = await orderApi.updateOrderStatus(id, status)
      setOrder(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (!order) return <div className="page-loading">Loading...</div>

  const nextOptions = NEXT_STATUS[order.status] || []

  return (
    <div className="admin-page">
      <button className="link-button" onClick={() => navigate('/admin/orders')}>
        &larr; Back to Orders
      </button>

      <div className="order-detail-header">
        <div>
          <h1>{order.orderNumber}</h1>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {error && <p className="error">{error}</p>}

      {nextOptions.length > 0 && (
        <div className="admin-toolbar">
          <span className="filter-label">Update status:</span>
          {nextOptions.map((s) => (
            <button key={s} className="btn btn-small" disabled={updating} onClick={() => handleStatusChange(s)}>
              Mark as {s}
            </button>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        <div className="order-items-card">
          <h2>Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="order-detail-item">
              <span>{item.productName}</span>
              <span>&times; {item.quantity}</span>
              <span>{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
          <div className="order-detail-total">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="order-shipping-card">
          <h2>Customer</h2>
          <p>{order.customerName}</p>
          <p>{order.customerEmail}</p>

          <h2>Shipping To</h2>
          <p>{order.shippingName}</p>
          <p>{order.shippingPhone}</p>
          <p>{order.shippingAddressLine}</p>
          <p>
            {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          </p>

          <h2>Payment</h2>
          <p className="payment-summary-row">
            <PaymentMethodIcon method={order.paymentMethod} />
            {paymentMethodLabel(order.paymentMethod)}
            <span className={`status-badge payment-status-${order.paymentStatus.toLowerCase()}`}>
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
