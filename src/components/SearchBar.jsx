import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../styles/searchbar.css'

export default function SearchBar({ compact }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') || '')

  function handleSubmit(e) {
    e.preventDefault()
    const q = value.trim()
    if (q) navigate(`/buscar?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      className={'searchbar' + (compact ? ' searchbar--compact' : '')}
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        className="searchbar__input"
        placeholder="Buscar producto…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Buscar producto"
      />
      <button type="submit" className="searchbar__btn" aria-label="Buscar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11.2" y1="11.2" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  )
}
