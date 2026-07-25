import { useEffect, useState } from 'react'
import * as adminApi from '../../api/adminApi'
import * as bannerApi from '../../api/bannerApi'

const emptyForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  displayOrder: 0,
  active: true,
  startDate: '',
  endDate: '',
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  function load() {
    bannerApi.getAdminBanners().then(setBanners)
  }

  useEffect(load, [])

  const filteredBanners = banners.filter((b) => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false
    if (status && String(b.active) !== status) return false
    return true
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(banner) {
    setEditingId(banner.id)
    setForm({ ...banner, startDate: banner.startDate || '', endDate: banner.endDate || '' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await adminApi.uploadImage(file)
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    }
    try {
      if (editingId) {
        await bannerApi.updateBanner(editingId, payload)
      } else {
        await bannerApi.createBanner(payload)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete banner "${title}"?`)) return
    try {
      await bannerApi.deleteBanner(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <h1>Banners</h1>
      <p className="hint">Banners appear in the homepage carousel &mdash; use them to promote offers and sales.</p>

      <div className="admin-split">
        <div>
          <div className="admin-toolbar">
            <input
              type="search"
              placeholder="Search banners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </div>

          {filteredBanners.length === 0 ? (
            <p className="empty-state">No banners match these filters.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <img src={b.imageUrl} alt={b.title} className="admin-table-thumb admin-table-thumb-wide" />
                    </td>
                    <td>
                      {b.title}
                      <div className="muted-text">{b.subtitle}</div>
                    </td>
                    <td>{b.displayOrder}</td>
                    <td>
                      <span className={`status-badge ${b.active ? 'status-delivered' : 'status-cancelled'}`}>
                        {b.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <button className="link-button" onClick={() => startEdit(b)}>
                        Edit
                      </button>
                      <button className="link-button danger" onClick={() => handleDelete(b.id, b.title)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form className="admin-form admin-form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Banner' : 'Add Banner'}</h2>

          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Subtitle
            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
          </label>

          <label>
            Banner Image
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          {uploading && <p className="hint">Uploading...</p>}
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="image-preview image-preview-wide" />}

          <label>
            Image URL
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
          </label>

          <label>
            Link URL (where the banner takes shoppers)
            <input name="linkUrl" value={form.linkUrl} onChange={handleChange} placeholder="/products?categoryId=1" />
          </label>

          <div className="form-row">
            <label>
              Display Order
              <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} />
            </label>
            <label>
              Start Date (optional)
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </label>
            <label>
              End Date (optional)
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </label>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button className="btn" type="submit">
              {editingId ? 'Save Changes' : 'Add Banner'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
