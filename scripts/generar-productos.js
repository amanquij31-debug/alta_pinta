// Lee productos.csv (categoria, nombre, descripcion) y empareja cada fila
// con las fotos que encuentre en public/products/<categoria>/, EN ORDEN.
// No hace falta escribir el nombre del archivo en el Excel: el orden de
// las filas de cada categoría debe coincidir con el orden de las fotos
// en su carpeta (mismo orden = mismo producto).
//
// Uso:  npm run generar-productos

import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync } from 'fs'
import { join, extname } from 'path'

const ROOT = new URL('..', import.meta.url)
const CSV_PATH = new URL('../productos.csv', import.meta.url)
const OUTPUT_PATH = new URL('../src/data/products.js', import.meta.url)
const PRODUCTS_DIR = new URL('../public/products/', import.meta.url)

const VALID_CATEGORIES = [
  { slug: 'gorros', label: 'Gorros' },
  { slug: 'morrales', label: 'Morrales' },
  { slug: 'mochilas', label: 'Mochilas' },
  { slug: 'billeteras', label: 'Billeteras' },
  { slug: 'bandoleras', label: 'Bandoleras' },
]
const VALID_SLUGS = new Set(VALID_CATEGORIES.map((c) => c.slug))
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (char === '"' && next === '"') { field += '"'; i++ }
      else if (char === '"') { inQuotes = false }
      else { field += char }
    } else {
      if (char === '"') inQuotes = true
      else if (char === ',') { row.push(field); field = '' }
      else if (char === '\n' || char === '\r') {
        if (char === '\r' && next === '\n') i++
        row.push(field); rows.push(row); row = []; field = ''
      } else field += char
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

// Orden "natural": foto-2 antes que foto-10 (no alfabético puro).
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function main() {
  if (!existsSync(CSV_PATH)) {
    console.error('No se encontró productos.csv en la raíz del proyecto.')
    process.exit(1)
  }

  const raw = readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCSV(raw)
  const [header, ...dataRows] = rows

  const expected = ['categoria', 'nombre', 'descripcion']
  const headerLower = header.map((h) => h.trim().toLowerCase())
  const okHeader = expected.every((col, i) => headerLower[i] === col)
  if (!okHeader) {
    console.error(`El encabezado del CSV debe ser exactamente: ${expected.join(',')}`)
    console.error(`Encontrado: ${header.join(',')}`)
    process.exit(1)
  }

  // Agrupar filas por categoría, respetando el orden en que aparecen.
  const rowsByCategory = {}
  const errors = []

  dataRows.forEach((cols, i) => {
    const lineNum = i + 2
    const [categoriaRaw, nombreRaw, descripcionRaw] = cols
    const categoria = (categoriaRaw || '').trim().toLowerCase()
    const nombre = (nombreRaw || '').trim()
    const descripcion = (descripcionRaw || '').trim()

    if (!VALID_SLUGS.has(categoria)) {
      errors.push(`Línea ${lineNum}: categoría "${categoria}" no válida.`)
      return
    }
    if (!nombre) {
      errors.push(`Línea ${lineNum}: falta el nombre del producto.`)
      return
    }
    rowsByCategory[categoria] = rowsByCategory[categoria] || []
    rowsByCategory[categoria].push({
      nombre,
      descripcion: descripcion || 'Descripción del producto pendiente.',
    })
  })

  if (errors.length > 0) {
    console.error(`Se encontraron ${errors.length} error(es) en productos.csv:\n`)
    errors.forEach((e) => console.error(' - ' + e))
    process.exit(1)
  }

  const products = []

  for (const cat of VALID_CATEGORIES) {
    const catRows = rowsByCategory[cat.slug] || []
    const folder = new URL(cat.slug + '/', PRODUCTS_DIR)
    let files = []
    if (existsSync(folder)) {
      files = readdirSync(folder)
        .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
        .sort(naturalSort)
    }

    if (catRows.length === 0 && files.length === 0) continue

    if (catRows.length !== files.length) {
      errors.push(
        `Categoría "${cat.slug}": hay ${catRows.length} fila(s) en el CSV pero ` +
        `${files.length} foto(s) en public/products/${cat.slug}/. Deben ser la misma cantidad.`
      )
      continue
    }

    catRows.forEach((row, idx) => {
      const num = String(idx + 1).padStart(2, '0')
      const originalFile = files[idx]
      const ext = extname(originalFile).toLowerCase()
      const finalName = `${cat.slug}-${num}${ext}`

      if (originalFile !== finalName) {
        renameSync(join(folder.pathname, originalFile), join(folder.pathname, finalName))
      }

      products.push({
        id: `${cat.slug}-${idx + 1}`,
        category: cat.slug,
        name: row.nombre,
        description: row.descripcion,
        image: `/products/${cat.slug}/${finalName}`,
      })
    })
  }

  if (errors.length > 0) {
    console.error(`Se encontraron ${errors.length} problema(s):\n`)
    errors.forEach((e) => console.error(' - ' + e))
    console.error('\nCorrige las cantidades y vuelve a correr el script.')
    process.exit(1)
  }

  const fileContent = `// GENERADO AUTOMÁTICAMENTE por scripts/generar-productos.js
// No edites este archivo a mano — edita productos.csv y las fotos en
// public/products/, y vuelve a correr:  npm run generar-productos

export const categories = ${JSON.stringify(VALID_CATEGORIES, null, 2)}

export const products = ${JSON.stringify(products, null, 2)}

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
`

  writeFileSync(OUTPUT_PATH, fileContent)
  console.log(`Listo. ${products.length} productos generados en src/data/products.js`)
}

main()
