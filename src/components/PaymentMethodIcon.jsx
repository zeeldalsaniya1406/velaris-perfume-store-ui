const LABELS = {
  COD: 'Cash on Delivery',
  GOOGLE_PAY: 'Google Pay',
}

export function paymentMethodLabel(method) {
  return LABELS[method] || method
}

function CodIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.25" y="6" width="19.5" height="13" rx="2" />
      <circle cx="12" cy="12.5" r="3" />
      <path d="M5.5 9.5v0M18.5 15.5v0" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function GooglePayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="#4285F4"
      >
        G
      </text>
    </svg>
  )
}

export function PaymentMethodIcon({ method }) {
  return method === 'GOOGLE_PAY' ? <GooglePayIcon /> : <CodIcon />
}
