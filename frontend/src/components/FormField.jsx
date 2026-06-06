export default function FormField({ label, error, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
