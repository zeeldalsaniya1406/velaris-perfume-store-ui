import { useEffect, useState } from 'react'
import * as adminApi from '../../api/adminApi'
import { formatDate } from '../../utils/format'

export default function AdminUsersPage() {
  const [page, setPage] = useState(null)
  const [pageNum, setPageNum] = useState(0)
  const [error, setError] = useState('')

  function load() {
    adminApi.getUsers({ page: pageNum, size: 15 }).then(setPage)
  }

  useEffect(load, [pageNum])

  async function toggleEnabled(user) {
    setError('')
    try {
      await adminApi.setUserEnabled(user.id, !user.enabled)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!page) return <div className="page-loading">Loading...</div>

  return (
    <div className="admin-page">
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {page.content.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <span className={`status-badge ${user.enabled ? 'status-delivered' : 'status-cancelled'}`}>
                  {user.enabled ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td>
                {user.role !== 'ADMIN' && (
                  <button className="link-button" onClick={() => toggleEnabled(user)}>
                    {user.enabled ? 'Disable' : 'Enable'}
                  </button>
                )}
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
    </div>
  )
}
