import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as categoryApi from '../../api/categoryApi'
import * as productApi from '../../api/productApi'
import ProductCard from '../../components/ProductCard'

const GENDERS = ['MEN', 'WOMEN', 'UNISEX']

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  const categoryId = searchParams.get('categoryId') || ''
  const gender = searchParams.get('gender') || ''
  const search = searchParams.get('search') || ''
  const pageNum = Number(searchParams.get('page') || 0)

  useEffect(() => {
    categoryApi.getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    productApi
      .searchProducts({
        categoryId: categoryId || undefined,
        gender: gender || undefined,
        search: search || undefined,
        page: pageNum,
        size: 12,
      })
      .then(setPage)
      .finally(() => setLoading(false))
  }, [categoryId, gender, search, pageNum])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  function goToPage(newPage) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(newPage))
    setSearchParams(next)
  }

  return (
    <div className="products-page">
      <aside className="filters">
        <h3>Filters</h3>

        <div className="filter-group">
          <label htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="search"
            defaultValue={search}
            placeholder="Search perfumes..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', e.target.value)
            }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Category</span>
          <button
            className={`filter-option ${categoryId === '' ? 'active' : ''}`}
            onClick={() => updateParam('categoryId', '')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-option ${categoryId === String(c.id) ? 'active' : ''}`}
              onClick={() => updateParam('categoryId', String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Gender</span>
          <button
            className={`filter-option ${gender === '' ? 'active' : ''}`}
            onClick={() => updateParam('gender', '')}
          >
            All
          </button>
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`filter-option ${gender === g ? 'active' : ''}`}
              onClick={() => updateParam('gender', g)}
            >
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </aside>

      <div className="products-results">
        {loading && <div className="page-loading">Loading...</div>}

        {!loading && page && (
          <>
            <p className="results-count">{page.totalElements} perfumes found</p>

            {page.content.length === 0 ? (
              <p className="empty-state">No products match these filters.</p>
            ) : (
              <div className="product-grid">
                {page.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {page.totalPages > 1 && (
              <div className="pagination">
                <button disabled={page.first} onClick={() => goToPage(pageNum - 1)}>
                  Previous
                </button>
                <span>
                  Page {pageNum + 1} of {page.totalPages}
                </span>
                <button disabled={page.last} onClick={() => goToPage(pageNum + 1)}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
