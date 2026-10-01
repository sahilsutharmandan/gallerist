import { useUi } from '../store/ui'
import Icon from './Icon'

export default function ThemeToggle() {
  const theme = useUi((s) => s.theme)
  const toggleTheme = useUi((s) => s.toggleTheme)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${next} theme`}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  )
}
