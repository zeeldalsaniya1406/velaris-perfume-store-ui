import client from './client'

export function placeOrder(payload) {
  return client.post('/orders', payload).then((res) => res.data)
}

export function getMyOrders() {
  return client.get('/orders/my').then((res) => res.data)
}

export function getOrder(id) {
  return client.get(`/orders/${id}`).then((res) => res.data)
}

export function getAdminOrders(params) {
  return client.get('/admin/orders', { params }).then((res) => res.data)
}

export function getAdminOrder(id) {
  return client.get(`/admin/orders/${id}`).then((res) => res.data)
}

export function updateOrderStatus(id, status) {
  return client.put(`/admin/orders/${id}/status`, { status }).then((res) => res.data)
}
