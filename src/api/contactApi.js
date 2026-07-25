import client from './client'

export function submitContactMessage(payload) {
  return client.post('/contact', payload).then((res) => res.data)
}

export function getAdminContactMessages(params) {
  return client.get('/admin/contact-messages', { params }).then((res) => res.data)
}

export function getAdminContactMessage(id) {
  return client.get(`/admin/contact-messages/${id}`).then((res) => res.data)
}

export function markContactMessageRead(id) {
  return client.put(`/admin/contact-messages/${id}/read`).then((res) => res.data)
}
