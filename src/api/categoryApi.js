import client from './client'

export function getCategories() {
  return client.get('/categories').then((res) => res.data)
}

export function getAdminCategories() {
  return client.get('/admin/categories').then((res) => res.data)
}

export function createCategory(payload) {
  return client.post('/admin/categories', payload).then((res) => res.data)
}

export function updateCategory(id, payload) {
  return client.put(`/admin/categories/${id}`, payload).then((res) => res.data)
}

export function deleteCategory(id) {
  return client.delete(`/admin/categories/${id}`)
}
