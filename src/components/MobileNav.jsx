import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import { NAV_ITEMS } from './Header'

export default function MobileNav({ badges = {} }) {
  return (
    <nav className="mobile-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="mobile-nav__link">
          <span className="mobile-nav__icon">
            <Icon name={item.icon} />
            {badges[item.to] ? <span className="badge badge--dot">{badges[item.to]}</span> : null}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
