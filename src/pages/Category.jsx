import { useParams, Navigate } from 'react-router-dom'
import { categories, getProductsByCategory } from '../data/products'
import ProductGrid from '../components/ProductGrid'
import ContactSection from '../components/ContactSection'
import '../styles/category.css'

export default function Category() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)

  if (!category) return <Navigate to="/" replace />

  const products = getProductsByCategory(slug)

  return (
    <>
      <section className="category-header">
        <span className="category-header__watermark" aria-hidden="true">
          {category.label}
        </span>
        <h1 className="category-header__title">{category.label}</h1>
      </section>
      <section className="category-content">
        <ProductGrid products={products} />
      </section>
      <ContactSection />
    </>
  )
}
