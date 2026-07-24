import client from './client'

export function getActiveBanners() {
  return client.get('/banners').then((res) => res.data)
}

export function getAdminBanners() {
  return client.get('/admin/banners').then((res) => res.data)
}

export function createBanner(payload) {
  return client.post('/admin/banners', payload).then((res) => res.data)
}

export function updateBanner(id, payload) {
  return client.put(`/admin/banners/${id}`, payload).then((res) => res.data)
}

export function deleteBanner(id) {
  return client.delete(`/admin/banners/${id}`)
}
