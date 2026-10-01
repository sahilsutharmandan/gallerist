import Icon from './Icon'

export function Loading({ label = 'Loading' }) {
  return (
    <div className="page-state">
      <div className="spinner" />
      <p className="muted">{label}…</p>
    </div>
  )
}

export function EmptyState({ icon = 'image', title, children, action }) {
  return (
    <div className="page-state page-state--empty">
      <span className="page-state__icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      {children ? <p className="muted">{children}</p> : null}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="page-state page-state--error">
      <span className="page-state__icon">
        <Icon name="alert" />
      </span>
      <h3>Something went wrong</h3>
      <p className="muted">{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}
