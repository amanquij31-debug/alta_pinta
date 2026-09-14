import { useState } from 'react'
import ProductCard from './ProductCard'
import '../styles/productgrid.css'

const PAGE_SIZE = 6

export default function ProductGrid({ products }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  return (
    <div>
      <div className="grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="grid__more">
          <button
            className="grid__more-btn"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  )
}
