import { Link, NavLink } from 'react-router-dom'
import Icon from './Icon'
import ThemeToggle from './ThemeToggle'

export const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/explore', label: 'Explore', icon: 'compass' },
  { to: '/collections', label: 'Collections', icon: 'folder' },
  { to: '/compare', label: 'Compare', icon: 'columns' },
]

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Gallerist home">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <rect x="5" y="5" width="22" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M9 23l5.5-7 3.6 4.4 2.4-3L24 23z" fill="currentColor" />
        </svg>
      </span>
      <span className="logo__word">Gallerist</span>
    </Link>
  )
}

export default function Header({ badges = {} }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Logo />
        <nav className="site-nav" aria-label="Main">
          {NAV_ITEMS.slice(1).map((item) => (
            <NavLink key={item.to} to={item.to} className="site-nav__link">
              {item.label}
              {badges[item.to] ? <span className="badge">{badges[item.to]}</span> : null}
            </NavLink>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link to="/explore" className="icon-btn" aria-label="Search the collection">
            <Icon name="search" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
