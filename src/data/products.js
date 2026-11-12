// GENERADO AUTOMÁTICAMENTE por scripts/generar-productos.js
// No edites este archivo a mano — edita productos.csv y las fotos en
// fotos-originales/ (o public/products/), y vuelve a correr:  npm run generar-productos

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
    "image": "/products/gorros/gorros-01.webp"
  },
  {
    "id": "gorros-2",
    "category": "gorros",
    "name": "Gorro Alta Pinta basico",
    "description": "Gorro bordado con logo frontal.",
    "image": "/products/gorros/gorros-02.webp"
  },
  {
    "id": "morrales-1",
    "category": "morrales",
    "name": "Morral basico 1",
    "description": "Morral basico 1",
    "image": "/products/morrales/morrales-01.webp"
  },
  {
    "id": "morrales-2",
    "category": "morrales",
    "name": "Morral basico 2",
    "description": "Morral basico 2",
    "image": "/products/morrales/morrales-02.webp"
  },
  {
    "id": "mochilas-1",
    "category": "mochilas",
    "name": "Mochila basica 2",
    "description": "Mochila basica 2",
    "image": "/products/mochilas/mochilas-01.webp"
  },
  {
    "id": "billeteras-1",
    "category": "billeteras",
    "name": "Billetera negra",
    "description": "Billetera negra",
    "image": "/products/billeteras/billeteras-01.webp"
  },
  {
    "id": "billeteras-2",
    "category": "billeteras",
    "name": "Billetera oscura",
    "description": "Billetera negra",
    "image": "/products/billeteras/billeteras-02.webp"
  },
  {
    "id": "bandoleras-1",
    "category": "bandoleras",
    "name": "Bandolera negra original",
    "description": "Bandolera negra original logo",
    "image": "/products/bandoleras/bandoleras-01.webp"
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
