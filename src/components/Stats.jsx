import { categories, products } from '../data/products'
import '../styles/home.css'

export default function Stats() {
  // Con pocos productos cargados mostramos un dato fijo en vez de un número chico.
  const total = products.length
  const productStat =
    total >= 10
      ? { value: `+${Math.floor(total / 10) * 10}`, label: 'Productos' }
      : { value: '★', label: 'Estilo propio' }

  const items = [
    { value: String(categories.length), label: 'Categorías' },
    productStat,
    { value: 'WhatsApp', label: 'Atención directa' },
  ]

  return (
    <section className="stats">
      {items.map((item) => (
        <div key={item.label} className="stats__item">
          <span className="stats__value">{item.value}</span>
          <span className="stats__label">{item.label}</span>
        </div>
      ))}
    </section>
  )
}
