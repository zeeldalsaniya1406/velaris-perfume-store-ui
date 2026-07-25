import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as contactApi from '../../api/contactApi'
import { formatDate } from '../../utils/format'

export default function AdminMessageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)

  useEffect(() => {
    contactApi.getAdminContactMessage(id).then((found) => {
      setMessage(found)
      if (!found.read) {
        contactApi.markContactMessageRead(id)
      }
    })
  }, [id])

  if (!message) return <div className="page-loading">Loading...</div>

  return (
    <div className="admin-page">
      <button className="link-button" onClick={() => navigate('/admin/messages')}>
        &larr; Back to Messages
      </button>

      <div className="order-detail-header">
        <div>
          <h1>{message.subject}</h1>
          <p className="order-date">
            From {message.name} &lt;{message.email}&gt; &mdash; {formatDate(message.createdAt)}
          </p>
        </div>
      </div>

      <div className="order-items-card">
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{message.message}</p>
      </div>
    </div>
  )
}
