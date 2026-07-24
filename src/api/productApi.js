import client from './client'

export function searchProducts(params) {
  return client.get('/products', { params }).then((res) => res.data)
}

export function getProduct(id) {
  return client.get(`/products/${id}`).then((res) => res.data)
}

export function searchAdminProducts(params) {
  return client.get('/admin/products', { params }).then((res) => res.data)
}

export function getAdminProduct(id) {
  return client.get(`/admin/products/${id}`).then((res) => res.data)
}

export function createProduct(payload) {
  return client.post('/admin/products', payload).then((res) => res.data)
}

export function updateProduct(id, payload) {
  return client.put(`/admin/products/${id}`, payload).then((res) => res.data)
}

export function deleteProduct(id) {
  return client.delete(`/admin/products/${id}`)
}
