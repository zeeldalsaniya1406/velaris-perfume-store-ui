import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/format'
import { useState } from 'react'

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleQuantityChange(itemId, quantity) {
    setError('')
    try {
      await updateItem(itemId, quantity)
    } catch (err) {
      setError(err.message)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {error && <p className="error">{error}</p>}

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.productImageUrl} alt={item.productName} />
            <div className="cart-item-info">
              <h3>{item.productName}</h3>
              <p>{formatCurrency(item.unitPrice)} each</p>
            </div>
            <div className="cart-item-quantity">
              <input
                type="number"
                min="1"
                max={item.availableStock}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
              />
            </div>
            <div className="cart-item-total">{formatCurrency(item.lineTotal)}</div>
            <button className="link-button danger" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <span className="cart-total-amount">{formatCurrency(cart.totalAmount)}</span>
      </div>

      <div className="cart-actions">
        <Link to="/products" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <button className="btn" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
