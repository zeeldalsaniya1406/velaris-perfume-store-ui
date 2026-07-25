import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as categoryApi from '../../api/categoryApi'
import * as productApi from '../../api/productApi'
import { formatCurrency } from '../../utils/format'

const GENDERS = ['MEN', 'WOMEN', 'UNISEX']

export default function AdminProductsPage() {
  const [page, setPage] = useState(null)
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [gender, setGender] = useState('')
  const [status, setStatus] = useState('')
  const [pageNum, setPageNum] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryApi.getAdminCategories().then(setCategories)
  }, [])

  function load() {
    setLoading(true)
    productApi
      .searchAdminProducts({
        search: search || undefined,
        categoryId: categoryId || undefined,
        gender: gender || undefined,
        active: status || undefined,
        page: pageNum,
        size: 15,
      })
      .then(setPage)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, categoryId, gender, status])

  function updateFilter(setter, value) {
    setter(value)
    setPageNum(0)
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setError('')
    try {
      await productApi.deleteProduct(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn">
          + Add Product
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPageNum(0)
              load()
            }
          }}
        />

        <select value={categoryId} onChange={(e) => updateFilter(setCategoryId, e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select value={gender} onChange={(e) => updateFilter(setGender, e.target.value)}>
          <option value="">All genders</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => updateFilter(setStatus, e.target.value)}>
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Hidden</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <div className="page-loading">Loading...</div>}

      {!loading && page && (
        <>
          <p className="results-count">{page.totalElements} product(s) found</p>

          {page.content.length === 0 ? (
            <p className="empty-state">No products match these filters.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {page.content.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.imageUrl} alt={product.name} className="admin-table-thumb" />
                    </td>
                    <td>
                      {product.name}
                      <div className="muted-text">{product.brand}</div>
                    </td>
                    <td>{product.categoryName}</td>
                    <td>
                      {formatCurrency(product.discountPrice ?? product.price)}
                      {product.discountPrice && (
                        <div className="muted-text strike">{formatCurrency(product.price)}</div>
                      )}
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.active ? 'status-delivered' : 'status-cancelled'}`}>
                        {product.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                      <button className="link-button danger" onClick={() => handleDelete(product.id, product.name)}>
                        Delete
                      </button>
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
        </>
      )}
    </div>
  )
}
