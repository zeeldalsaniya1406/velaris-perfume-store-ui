const STATUS_CLASS = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
}

export default function OrderStatusBadge({ status }) {
  return <span className={`status-badge ${STATUS_CLASS[status] || ''}`}>{status}</span>
}
