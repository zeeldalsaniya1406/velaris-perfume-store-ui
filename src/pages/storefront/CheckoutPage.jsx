import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as orderApi from '../../api/orderApi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { PaymentMethodIcon } from '../../components/PaymentMethodIcon'
import { formatCurrency } from '../../utils/format'

const emptyForm = {
  shippingName: '',
  shippingPhone: '',
  shippingAddressLine: '',
  shippingCity: '',
  shippingState: '',
  shippingPincode: '',
  paymentMethod: 'COD',
}

const PAYMENT_OPTIONS = [
  { value: 'COD', title: 'Cash on Delivery', subtitle: 'Pay with cash when your order arrives' },
  { value: 'GOOGLE_PAY', title: 'Google Pay', subtitle: 'Pay securely using UPI' },
]

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, refresh } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...emptyForm, shippingName: user?.name || '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [gpayPhase, setGpayPhase] = useState(null) // null | 'redirecting' | 'success'

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function submitOrder() {
    const order = await orderApi.placeOrder(form)
    await refresh()
    navigate(`/my-orders/${order.id}`, { state: { justPlaced: true } })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (form.paymentMethod === 'GOOGLE_PAY') {
        setGpayPhase('redirecting')
        await wait(1400)
        setGpayPhase('success')
        await wait(900)
      }
      await submitOrder()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      setGpayPhase(null)
    }
  }

  if (cart.items.length === 0) {
    return <p className="empty-state">Your cart is empty.</p>
  }

  const isGooglePay = form.paymentMethod === 'GOOGLE_PAY'

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h1>Shipping Details</h1>

        <label>
          Full Name
          <input name="shippingName" value={form.shippingName} onChange={handleChange} required />
        </label>

        <label>
          Phone
          <input name="shippingPhone" value={form.shippingPhone} onChange={handleChange} required />
        </label>

        <label>
          Address
          <input name="shippingAddressLine" value={form.shippingAddressLine} onChange={handleChange} required />
        </label>

        <div className="form-row">
          <label>
            City
            <input name="shippingCity" value={form.shippingCity} onChange={handleChange} required />
          </label>
          <label>
            State
            <input name="shippingState" value={form.shippingState} onChange={handleChange} required />
          </label>
          <label>
            Pincode
            <input name="shippingPincode" value={form.shippingPincode} onChange={handleChange} required />
          </label>
        </div>

        <div className="payment-section">
          <span className="payment-section-label">Payment Method</span>
          <div className="payment-options">
            {PAYMENT_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`payment-option ${form.paymentMethod === option.value ? 'selected' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, paymentMethod: option.value }))}
              >
                <span className="payment-option-icon">
                  <PaymentMethodIcon method={option.value} />
                </span>
                <span className="payment-option-text">
                  <span className="payment-option-title">{option.title}</span>
                  <span className="payment-option-subtitle">{option.subtitle}</span>
                </span>
                <span className="payment-option-radio" />
              </button>
            ))}
          </div>
          {isGooglePay && (
            <p className="hint">This is a demo checkout &mdash; Google Pay payments are simulated, no real charge is made.</p>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting
            ? isGooglePay
              ? 'Processing payment...'
              : 'Placing order...'
            : isGooglePay
              ? `Pay ${formatCurrency(cart.totalAmount)} with Google Pay`
              : `Place Order — ${formatCurrency(cart.totalAmount)}`}
        </button>
      </form>

      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            <span>
              {item.productName} &times; {item.quantity}
            </span>
            <span>{formatCurrency(item.lineTotal)}</span>
          </div>
        ))}
        <div className="checkout-summary-total">
          <span>Total</span>
          <span>{formatCurrency(cart.totalAmount)}</span>
        </div>
      </div>

      {gpayPhase && (
        <div className="gpay-modal-backdrop">
          <div className="gpay-modal">
            {gpayPhase === 'redirecting' ? (
              <>
                <span className="gpay-spinner" />
                <p className="gpay-modal-title">Redirecting to Google Pay&hellip;</p>
                <p className="gpay-modal-subtitle">
                  Confirm the payment of {formatCurrency(cart.totalAmount)} on your UPI app
                </p>
              </>
            ) : (
              <>
                <span className="gpay-success-check">&#10003;</span>
                <p className="gpay-modal-title">Payment Successful</p>
                <p className="gpay-modal-subtitle">{formatCurrency(cart.totalAmount)} paid via Google Pay</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
