import { ABOUT } from '../data/content'
import '../styles/home.css'

export default function About() {
  return (
    <section id="sobre-nosotros" className="about">
      <p className="eyebrow">{ABOUT.eyebrow}</p>
      <h2 className="about__title">{ABOUT.title}</h2>
      <div className="about__text">
        {ABOUT.paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
        {ABOUT.tagline && <p className="about__tag">{ABOUT.tagline}</p>}
      </div>
    </section>
  )
}
