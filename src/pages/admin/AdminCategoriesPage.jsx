import { useEffect, useState } from 'react'
import * as adminApi from '../../api/adminApi'
import * as categoryApi from '../../api/categoryApi'

const emptyForm = { name: '', description: '', imageUrl: '', active: true }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  function load() {
    categoryApi.getAdminCategories().then(setCategories)
  }

  useEffect(load, [])

  const filteredCategories = categories.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (status && String(c.active) !== status) return false
    return true
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(category) {
    setEditingId(category.id)
    setForm({ ...category })
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
    try {
      if (editingId) {
        await categoryApi.updateCategory(editingId, form)
      } else {
        await categoryApi.createCategory(form)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await categoryApi.deleteCategory(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <h1>Categories</h1>

      <div className="admin-split">
        <div>
          <div className="admin-toolbar">
            <input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="empty-state">No categories match these filters.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <img src={c.imageUrl} alt={c.name} className="admin-table-thumb" />
                    </td>
                    <td>
                      {c.name}
                      <div className="muted-text">{c.description}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${c.active ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <button className="link-button" onClick={() => startEdit(c)}>
                        Edit
                      </button>
                      <button className="link-button danger" onClick={() => handleDelete(c.id, c.name)}>
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
          <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>

          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
          </label>

          <label>
            Image
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          {uploading && <p className="hint">Uploading...</p>}
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="image-preview" />}

          <label>
            Image URL
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button className="btn" type="submit">
              {editingId ? 'Save Changes' : 'Add Category'}
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
