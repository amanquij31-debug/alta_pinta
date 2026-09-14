import { NavLink } from 'react-router-dom'
import { categories } from '../data/products'
import SearchBar from './SearchBar'
import '../styles/navbar.css'

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <img src="/logo.png" alt="Alta Pinta" className="navbar__logo" />
        </NavLink>
        <nav className="navbar__links">
          {categories.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {cat.label}
            </NavLink>
          ))}
        </nav>
        <SearchBar />
      </div>
    </header>
  )
}
