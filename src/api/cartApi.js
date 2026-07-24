import client from './client'

export function getCart() {
  return client.get('/cart').then((res) => res.data)
}

export function addToCart(productId, quantity) {
  return client.post('/cart/items', { productId, quantity }).then((res) => res.data)
}

export function updateCartItem(itemId, quantity) {
  return client.put(`/cart/items/${itemId}`, null, { params: { quantity } }).then((res) => res.data)
}

export function removeCartItem(itemId) {
  return client.delete(`/cart/items/${itemId}`).then((res) => res.data)
}

export function clearCart() {
  return client.delete('/cart')
}
