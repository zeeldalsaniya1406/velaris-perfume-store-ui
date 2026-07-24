import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as orderApi from '../../api/orderApi'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [page, setPage] = useState(null)
  const [status, setStatus] = useState('')
  const [pageNum, setPageNum] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    orderApi
      .getAdminOrders({ status: status || undefined, page: pageNum, size: 15 })
      .then(setPage)
      .finally(() => setLoading(false))
  }, [status, pageNum])

  return (
    <div className="admin-page">
      <h1>Orders</h1>

      <div className="admin-toolbar">
        <button className={`filter-option ${status === '' ? 'active' : ''}`} onClick={() => { setStatus(''); setPageNum(0) }}>
          All
        </button>
        {STATUSES.map((s) => (
          <button key={s} className={`filter-option ${status === s ? 'active' : ''}`} onClick={() => { setStatus(s); setPageNum(0) }}>
            {s}
          </button>
        ))}
      </div>

      {loading && <div className="page-loading">Loading...</div>}

      {!loading && page && (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {page.content.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.orderNumber}
                    <div className="muted-text">{formatDate(order.createdAt)}</div>
                  </td>
                  <td>
                    {order.customerName}
                    <div className="muted-text">{order.customerEmail}</div>
                  </td>
                  <td>{order.items.length}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {page.totalPages > 1 && (
            <div className="pagination">
              <button disabled={page.first} onClick={() => setPageNum((p) => p - 1)}>
                Previous
              </button>
              <span>
                Page {pageNum + 1} of {page.totalPages}
              </span>
              <button disabled={page.last} onClick={() => setPageNum((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
