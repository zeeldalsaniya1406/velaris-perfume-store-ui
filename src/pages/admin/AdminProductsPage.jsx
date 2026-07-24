import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as productApi from '../../api/productApi'
import { formatCurrency } from '../../utils/format'

export default function AdminProductsPage() {
  const [page, setPage] = useState(null)
  const [search, setSearch] = useState('')
  const [pageNum, setPageNum] = useState(0)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    productApi
      .searchAdminProducts({ search: search || undefined, page: pageNum, size: 15 })
      .then(setPage)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum])

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    await productApi.deleteProduct(id)
    load()
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
      </div>

      {loading && <div className="page-loading">Loading...</div>}

      {!loading && page && (
        <>
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
