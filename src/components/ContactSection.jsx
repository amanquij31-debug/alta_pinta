import { CONTACT, whatsappLink } from '../data/config'
import '../styles/contactsection.css'

export default function ContactSection() {
  return (
    <section className="contact">
      <h2 className="contact__title">¿Te interesa alguna pieza?</h2>
      <p className="contact__desc">
        Escríbenos y coordinamos disponibilidad, tallas y entrega.
      </p>
      <div className="contact__links">
        <a href={whatsappLink()} className="contact__link" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a href={CONTACT.instagram} className="contact__link" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </section>
  )
}
