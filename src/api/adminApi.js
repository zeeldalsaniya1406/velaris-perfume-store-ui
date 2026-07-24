import client from './client'

export function getUsers(params) {
  return client.get('/admin/users', { params }).then((res) => res.data)
}

export function setUserEnabled(id, enabled) {
  return client.put(`/admin/users/${id}/status`, null, { params: { enabled } }).then((res) => res.data)
}

export function getDashboardSummary() {
  return client.get('/admin/dashboard/summary').then((res) => res.data)
}

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return client
    .post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}
