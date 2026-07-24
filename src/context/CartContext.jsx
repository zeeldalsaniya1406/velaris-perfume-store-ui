import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import * as cartApi from '../api/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const emptyCart = { items: [], totalAmount: 0, totalItems: 0 }

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(emptyCart)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setCart(emptyCart)
      return Promise.resolve()
    }
    setLoading(true)
    return cartApi
      .getCart()
      .then(setCart)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addItem(productId, quantity = 1) {
    const updated = await cartApi.addToCart(productId, quantity)
    setCart(updated)
  }

  async function updateItem(itemId, quantity) {
    const updated = await cartApi.updateCartItem(itemId, quantity)
    setCart(updated)
  }

  async function removeItem(itemId) {
    const updated = await cartApi.removeCartItem(itemId)
    setCart(updated)
  }

  async function clear() {
    await cartApi.clearCart()
    setCart(emptyCart)
  }

  const value = { cart, loading, addItem, updateItem, removeItem, clear, refresh }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
