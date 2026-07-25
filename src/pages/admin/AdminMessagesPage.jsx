import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as contactApi from '../../api/contactApi'
import { formatDate } from '../../utils/format'

export default function AdminMessagesPage() {
  const [page, setPage] = useState(null)
  const [pageNum, setPageNum] = useState(0)

  useEffect(() => {
    contactApi.getAdminContactMessages({ page: pageNum, size: 20 }).then(setPage)
  }, [pageNum])

  if (!page) return <div className="page-loading">Loading...</div>

  return (
    <div className="admin-page">
      <h1>Messages</h1>

      {page.content.length === 0 ? (
        <p className="empty-state">No messages yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>From</th>
              <th>Subject</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {page.content.map((m) => (
              <tr key={m.id} className={m.read ? '' : 'admin-table-row-unread'}>
                <td>
                  {!m.read && <span className="status-badge payment-status-pending">New</span>}
                </td>
                <td>
                  {m.name}
                  <div className="muted-text">{m.email}</div>
                </td>
                <td>{m.subject}</td>
                <td>{formatDate(m.createdAt)}</td>
                <td>
                  <Link to={`/admin/messages/${m.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
    </div>
  )
}
