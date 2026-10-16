import { NavLink, Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import '../styles/navbar.css'

const linkClass = ({ isActive }) =>
  'navbar__link' + (isActive ? ' navbar__link--active' : '')

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <img src="/logo.png" alt="Alta Pinta" className="navbar__logo" />
        </NavLink>
        <nav className="navbar__links">
          <NavLink to="/" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
          <Link to="/#sobre-nosotros" className="navbar__link">Sobre nosotros</Link>
          <Link to="/#contacto" className="navbar__link">Contacto</Link>
        </nav>
        <SearchBar />
      </div>
    </header>
  )
}
