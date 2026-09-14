import { whatsappLink } from '../data/config'
import '../styles/productcard.css'

export default function ProductCard({ product }) {
  const message = `Hola, me interesa "${product.name}" que vi en el catálogo de Alta Pinta.`

  return (
    <article className="card">
      <div className="card__image">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="card__placeholder">Foto pendiente</div>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <p className="card__desc">{product.description}</p>
        <a
          href={whatsappLink(message)}
          className="card__whatsapp"
          target="_blank"
          rel="noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  )
}
