import { useSearchParams } from 'react-router-dom'
import { categories, products, getProductsByCategory } from '../data/products'
import ProductGrid from '../components/ProductGrid'
import ContactSection from '../components/ContactSection'
import '../styles/category.css'
import '../styles/catalog.css'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('cat')
  const active = categories.some((c) => c.slug === requested) ? requested : 'todos'
  const list = active === 'todos' ? products : getProductsByCategory(active)

  const select = (slug) => setParams(slug === 'todos' ? {} : { cat: slug })

  return (
    <>
      <section className="category-header">
        <span className="category-header__watermark" aria-hidden="true">Catálogo</span>
        <h1 className="category-header__title">Catálogo</h1>
      </section>
      <section className="category-content">
        <div className="filters">
          {[{ slug: 'todos', label: 'Todos' }, ...categories].map((c) => (
            <button
              key={c.slug}
              className={'filters__btn' + (c.slug === active ? ' filters__btn--active' : '')}
              onClick={() => select(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ProductGrid key={active} products={list} />
      </section>
      <ContactSection />
    </>
  )
}
