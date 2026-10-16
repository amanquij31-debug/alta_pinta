import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import CategoryCards from '../components/CategoryCards'
import HowToBuy from '../components/HowToBuy'
import ContactSection from '../components/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <CategoryCards />
      <HowToBuy />
      <ContactSection />
    </>
  )
}
