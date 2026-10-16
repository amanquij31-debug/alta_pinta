import { Link } from 'react-router-dom'
import { CONTACT, whatsappLink } from '../data/config'
import { SCHEDULE } from '../data/content'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt="Alta Pinta" className="footer__logo" />
          <p>Gorros, morrales, mochilas, billeteras y bandoleras.</p>
        </div>
        <div className="footer__col">
          <h4>Explora</h4>
          <Link to="/catalogo">Catálogo completo</Link>
          <Link to="/#sobre-nosotros">Sobre nosotros</Link>
          <Link to="/#contacto">Contacto</Link>
        </div>
        <div className="footer__col">
          <h4>Contacto</h4>
          <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
          {SCHEDULE && <span>{SCHEDULE}</span>}
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Alta Pinta</p>
    </footer>
  )
}
