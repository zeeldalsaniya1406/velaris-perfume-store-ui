import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import * as orderApi from '../../api/orderApi'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import { PaymentMethodIcon, paymentMethodLabel } from '../../components/PaymentMethodIcon'
import { formatCurrency, formatDate } from '../../utils/format'

export default function OrderDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    orderApi.getOrder(id).then(setOrder)
  }, [id])

  if (!order) return <div className="page-loading">Loading...</div>

  return (
    <div className="order-detail-page">
      {location.state?.justPlaced && (
        <p className="success banner-success">Your order has been placed successfully!</p>
      )}

      <div className="order-detail-header">
        <div>
          <h1>{order.orderNumber}</h1>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

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
