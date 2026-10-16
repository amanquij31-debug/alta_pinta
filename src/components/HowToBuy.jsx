import { STEPS } from '../data/content'
import '../styles/home.css'

export default function HowToBuy() {
  return (
    <section className="howto">
      <p className="eyebrow">Cómo comprar</p>
      <h2 className="howto__title">Así de fácil</h2>
      <ol className="howto__list">
        {STEPS.map((step, i) => (
          <li key={step.title} className="howto__item">
            <span className="howto__num">{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
