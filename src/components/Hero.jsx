import { Link } from 'react-router-dom'
import '../styles/hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__inner">
        <img src="/logo.png" alt="Alta Pinta" className="hero__logo" />
        <h1 className="hero__title">
          Alta Pinta
        </h1>
        <p className="hero__sub">
          Mochilas, morrales, billeteras, gorros y bandoleras hechos
          para andar por la calle con actitud.
        </p>
        <Link to="/catalogo" className="hero__cta">Ver catálogo</Link>
      </div>
    </section>
  )
}
