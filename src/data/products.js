// GENERADO AUTOMÁTICAMENTE por scripts/generar-productos.js
// No edites este archivo a mano — edita productos.csv y las fotos en
// public/products/, y vuelve a correr:  npm run generar-productos

export const categories = [
  {
    "slug": "gorros",
    "label": "Gorros"
  },
  {
    "slug": "morrales",
    "label": "Morrales"
  },
  {
    "slug": "mochilas",
    "label": "Mochilas"
  },
  {
    "slug": "billeteras",
    "label": "Billeteras"
  },
  {
    "slug": "bandoleras",
    "label": "Bandoleras"
  }
]

export const products = [
  {
    "id": "gorros-1",
    "category": "gorros",
    "name": "Gorro Alta Pinta Classic",
    "description": "Gorro bordado con logo frontal.",
    "image": "/products/gorros/gorros-01.jpg"
  },
  {
    "id": "mochilas-1",
    "category": "mochilas",
    "name": "Mochila Urbana Negra",
    "description": "Mochila resistente al agua con compartimento para laptop.",
    "image": "/products/mochilas/mochilas-01.jpg"
  }
]

export function getProductsByCategory(slug) {
  return products.filter((p) => p.category === slug)
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}
