import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import '../styles/hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__row">
        <img src="/logo.png" alt="Alta Pinta" className="hero__logo" />
        <div className="hero__copy">
          <h1 className="hero__title">
            Pinta alta,
            <br />
            estilo propio.
          </h1>
          <p className="hero__sub">
            Gorros, morrales, mochilas, billeteras y bandoleras hechos
            para andar por la calle con actitud.
          </p>
        </div>
      </div>

      <div className="hero__cats">
        {categories.map((cat) => (
          <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="hero__cat">
            <span className="hero__cat-star">★</span>
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
