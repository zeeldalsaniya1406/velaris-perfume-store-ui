export default function BottleIllustration({ color = '#C9A84C', label, sublabel }) {
  return (
    <div className="bottle-illus" aria-hidden="true">
      <div className="bi-cap" />
      <div className="bi-neck" />
      <div className="bi-body">
        <div className="bi-liquid" style={{ background: color }} />
        {label && (
          <div className="bi-label">
            <span className="bi-label-name">{label}</span>
            {sublabel && <span className="bi-label-sub">{sublabel}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
