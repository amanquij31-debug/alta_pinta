import { Link } from 'react-router-dom'
import { categories, getProductsByCategory } from '../data/products'
import '../styles/home.css'

export default function CategoryCards() {
  return (
    <section className="catcards">
      <p className="eyebrow">Categorías</p>
      <h2 className="catcards__title">Encuentra lo tuyo</h2>
      <div className="catcards__grid">
        {categories.map((cat) => {
          const first = getProductsByCategory(cat.slug)[0]
          return (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="catcard">
              <span className="catcard__star" aria-hidden="true">★</span>
              {first?.image && (
                <img
                  src={first.image}
                  alt=""
                  loading="lazy"
                  className="catcard__img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}
              <span className="catcard__shade" aria-hidden="true" />
              <span className="catcard__label">
                {cat.label}
                <span className="catcard__more">Ver todo →</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
