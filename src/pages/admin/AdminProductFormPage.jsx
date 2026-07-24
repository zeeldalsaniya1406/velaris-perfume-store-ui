import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as adminApi from '../../api/adminApi'
import * as categoryApi from '../../api/categoryApi'
import * as productApi from '../../api/productApi'

const emptyForm = {
  name: '',
  brand: '',
  sku: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: 0,
  imageUrl: '',
  gender: 'UNISEX',
  volumeMl: 100,
  categoryId: '',
  active: true,
}

export default function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    categoryApi.getAdminCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (isEdit) {
      productApi.getAdminProduct(id).then((p) =>
        setForm({
          ...p,
          price: p.price,
          discountPrice: p.discountPrice ?? '',
          categoryId: p.categoryId,
        })
      )
    }
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
    setSubmitting(true)

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
      stock: Number(form.stock),
      volumeMl: Number(form.volumeMl),
      categoryId: Number(form.categoryId),
    }

    try {
      if (isEdit) {
        await productApi.updateProduct(id, payload)
      } else {
        await productApi.createProduct(payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Brand
            <input name="brand" value={form.brand} onChange={handleChange} />
          </label>
        </div>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>

        <div className="form-row">
          <label>
            SKU
            <input name="sku" value={form.sku} onChange={handleChange} />
          </label>
          <label>
            Category
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Price (₹)
            <input type="number" name="price" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Discount Price (₹, optional)
            <input type="number" name="discountPrice" min="0" step="0.01" value={form.discountPrice} onChange={handleChange} />
          </label>
          <label>
            Stock
            <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} required />
          </label>
          <label>
            Volume (ml)
            <input type="number" name="volumeMl" min="0" value={form.volumeMl} onChange={handleChange} />
          </label>
        </div>

        <label>
          Product Image
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {uploading && <p className="hint">Uploading...</p>}
        {form.imageUrl && (
          <img src={form.imageUrl} alt="Preview" className="image-preview" />
        )}
        <label>
          Image URL (or paste a link instead of uploading)
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          Visible in storefront
        </label>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
