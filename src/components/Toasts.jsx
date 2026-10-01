import { useUi } from '../store/ui'
import Icon from './Icon'

const TONE_ICON = { success: 'check', danger: 'alert', default: 'info' }

export default function Toasts() {
  const toasts = useUi((s) => s.toasts)
  const dismiss = useUi((s) => s.dismissToast)
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tone}`}>
          <span className="toast__icon">
            <Icon name={TONE_ICON[t.tone] ?? 'info'} />
          </span>
          <p className="toast__msg">{t.message}</p>
          <button type="button" className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            <Icon name="close" />
          </button>
        </div>
      ))}
    </div>
  )
}
