import { useSearchParams } from 'react-router-dom'
import { searchProducts } from '../data/products'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import ContactSection from '../components/ContactSection'
import '../styles/search.css'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const results = searchProducts(query)

  return (
    <>
      <section className="search-header">
        <h1 className="search-header__title">
          {results.length > 0
            ? `${results.length} resultado${results.length === 1 ? '' : 's'} para "${query}"`
            : `Sin resultados para "${query}"`}
        </h1>
        <SearchBar compact />
      </section>
      <section className="category-content">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <p className="search-empty">
            Prueba con otra palabra, por ejemplo el nombre de una categoría
            como "mochila" o "gorro".
          </p>
        )}
      </section>
      <ContactSection />
    </>
  )
}
