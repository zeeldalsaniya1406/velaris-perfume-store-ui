import { useState } from 'react'
import * as contactApi from '../../api/contactApi'
import { useAuth } from '../../context/AuthContext'

const emptyForm = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    ...emptyForm,
    name: user?.name || '',
    email: user?.email || '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await contactApi.submitContactMessage(form)
      setSent(true)
      setForm({ ...emptyForm, name: user?.name || '', email: user?.email || '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-intro">
        <h1>Contact Us</h1>
        <p>
          Questions about an order, a fragrance, or anything else &mdash; we&rsquo;d love to hear from
          you. We usually reply within 1&ndash;2 business days.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {sent ? (
          <p className="success">
            Thanks for reaching out! Your message has been sent &mdash; we&rsquo;ll get back to you soon.
          </p>
        ) : (
          <>
            <div className="form-row">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>

            <label>
              Subject
              <input name="subject" value={form.subject} onChange={handleChange} required />
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                maxLength={2000}
                required
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
