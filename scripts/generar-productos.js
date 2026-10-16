// Lee productos.csv (categoria, nombre, descripcion) y empareja cada fila
// con las fotos de su categoría, EN ORDEN. Luego genera:
//   - src/data/products.js        (los datos que usa el catálogo)
//   - public/p/<id>.html          (una página por producto, con vista previa
//                                  de foto para WhatsApp)
//   - public/p/img/<id>.jpg       (miniatura liviana para esa vista previa)
//
// FOTOS: hay dos formas de trabajar.
//  A) Recomendada: pon tus fotos tal cual (pesadas) en
//     fotos-originales/<categoria>/. El script las reduce y convierte a webp
//     y las guarda en public/products/<categoria>/. Solo procesa las nuevas.
//  B) Sin compresión: pon las fotos ya listas directo en
//     public/products/<categoria>/ (solo si NO existe fotos-originales/<categoria>/).
//
// Uso:  npm run generar-productos

import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync, mkdirSync, rmSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { CONTACT, SITE_URL, productUrl, productMessage, whatsappLink } from '../src/data/config.js'

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  // sin sharp: el script funciona igual, pero no comprime ni crea miniaturas
}

const MAX_WIDTH = 1000 // ancho máximo de las fotos del catálogo (px)
const WEBP_QUALITY = 80
const PREVIEW_WIDTH = 600 // ancho de la miniatura para WhatsApp

const ROOT = new URL('..', import.meta.url)
const CSV_PATH = new URL('../productos.csv', import.meta.url)
const OUTPUT_PATH = new URL('../src/data/products.js', import.meta.url)
const PRODUCTS_DIR = new URL('../public/products/', import.meta.url)
const ORIGINALS_DIR = new URL('../fotos-originales/', import.meta.url)
const PAGES_DIR = new URL('../public/p/', import.meta.url)
const PUBLIC_DIR = new URL('../public/', import.meta.url)

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

const toPath = (url) => fileURLToPath(url)

const isImage = (f) => IMAGE_EXT.has(extname(f).toLowerCase())

// Comprime fotos-originales/<slug>/ -> public/products/<slug>/<slug>-NN.webp
// Devuelve true si esa categoría se maneja con originales.
async function comprimirOriginales(slug) {
  const srcDir = toPath(new URL(slug + '/', ORIGINALS_DIR))
  if (!existsSync(srcDir)) return false
  const srcFiles = readdirSync(srcDir).filter(isImage).sort(naturalSort)
  if (srcFiles.length === 0) return false

  if (!sharp) {
    console.error('Hay fotos en fotos-originales/ pero falta la librería "sharp".')
    console.error('Corre:  npm install   y vuelve a intentar.')
    process.exit(1)
  }

  const outDir = toPath(new URL(slug + '/', PRODUCTS_DIR))
  mkdirSync(outDir, { recursive: true })
  const manifestPath = join(outDir, '.origen.json')
  const prev = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf-8')) : {}
  const next = {}
  const esperados = new Set()
  let nuevas = 0

  for (let i = 0; i < srcFiles.length; i++) {
    const outName = `${slug}-${String(i + 1).padStart(2, '0')}.webp`
    const srcPath = join(srcDir, srcFiles[i])
    const st = statSync(srcPath)
    const firma = `${srcFiles[i]}|${st.size}|${Math.floor(st.mtimeMs)}`
    const outPath = join(outDir, outName)
    esperados.add(outName)
    next[outName] = firma
    if (prev[outName] === firma && existsSync(outPath)) continue
    await sharp(srcPath)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath)
    nuevas++
  }

  // Borra fotos que ya no corresponden (p. ej. si quitaste una original).
  for (const f of readdirSync(outDir)) {
    if (isImage(f) && !esperados.has(f)) rmSync(join(outDir, f))
  }
  writeFileSync(manifestPath, JSON.stringify(next, null, 2))
  console.log(`  ${slug}: ${srcFiles.length} foto(s), ${nuevas} procesada(s) ahora.`)
  return true
}

const esc = (t) =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function paginaProducto(p, ogImage) {
  const cat = VALID_CATEGORIES.find((c) => c.slug === p.category)
  const url = productUrl(p.id)
  const title = `${p.name} — Alta Pinta`
  const wa = whatsappLink(productMessage(p))
  const img = p.image
    ? `<img class="foto" src="${esc(p.image)}" alt="${esc(p.name)}" />`
    : `<div class="foto vacia">Foto pendiente</div>`
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="icon" type="image/png" href="/logo.png" />
<link rel="canonical" href="${esc(url)}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="Alta Pinta" />
<meta property="og:title" content="${esc(p.name)}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${esc(ogImage)}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Work+Sans:wght@400;500&display=swap" rel="stylesheet" />
<style>
*{box-sizing:border-box}
body{margin:0;background:#0a0a0b;color:#f4f4f2;font-family:'Work Sans',sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
header{padding:14px 20px;border-bottom:1px solid #2a2a2d}
header img{height:44px;width:auto}
main{max-width:980px;margin:0 auto;padding:32px 20px 56px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
.foto{width:100%;height:auto;border:1px solid #2a2a2d;background:#151517}
.vacia{aspect-ratio:1;display:flex;align-items:center;justify-content:center;color:#8b8e94}
.cat{font-family:'Oswald',sans-serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#e8b23d}
h1{font-family:'Oswald',sans-serif;font-weight:600;font-size:clamp(28px,5vw,42px);line-height:1.05;margin:8px 0 14px;text-transform:uppercase}
p{color:#c9ccd1;line-height:1.6;margin:0 0 24px}
.btn{display:inline-block;font-family:'Oswald',sans-serif;font-size:15px;letter-spacing:.06em;text-transform:uppercase;background:#e8b23d;color:#0a0a0b;padding:14px 30px;border-radius:2px}
.btn:hover{background:#f5c85c}
.volver{display:block;margin-top:22px;color:#8b8e94;font-size:14px}
.volver:hover{color:#f5c85c}
@media(max-width:700px){main{grid-template-columns:1fr}}
</style>
</head>
<body>
<header><a href="/"><img src="/logo.png" alt="Alta Pinta" /></a></header>
<main>
${img}
<div>
<span class="cat">${esc(cat ? cat.label : '')}</span>
<h1>${esc(p.name)}</h1>
<p>${esc(p.description)}</p>
<a class="btn" href="${esc(wa)}" target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
<a class="volver" href="/categoria/${esc(p.category)}">← Ver más ${esc(cat ? cat.label.toLowerCase() : 'productos')}</a>
</div>
</main>
</body>
</html>
`
}

// Crea public/p/<id>.html y la miniatura public/p/img/<id>.jpg de cada producto.
async function generarPaginas(products) {
  const dir = toPath(PAGES_DIR)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(join(dir, 'img'), { recursive: true })
  let conMiniatura = 0

  for (const p of products) {
    let ogImage = p.image ? SITE_URL + p.image : SITE_URL + '/logo.png'
    const fotoPath = p.image ? join(toPath(PUBLIC_DIR), p.image) : null
    if (sharp && fotoPath && existsSync(fotoPath)) {
      try {
        await sharp(fotoPath)
          .rotate()
          .resize({ width: PREVIEW_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: 78 })
          .toFile(join(dir, 'img', `${p.id}.jpg`))
        ogImage = `${SITE_URL}/p/img/${p.id}.jpg`
        conMiniatura++
      } catch (e) {
        console.warn(`  No se pudo crear la miniatura de ${p.id}: ${e.message}`)
      }
    }
    writeFileSync(join(dir, `${p.id}.html`), paginaProducto(p, ogImage))
  }
  console.log(`  ${products.length} página(s) de producto en public/p/ (${conMiniatura} con miniatura).`)
}

async function main() {
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
    await comprimirOriginales(cat.slug)
    const folder = new URL(cat.slug + '/', PRODUCTS_DIR)
    const folderPath = toPath(folder)
    let files = []
    if (existsSync(folderPath)) {
      files = readdirSync(folderPath).filter(isImage).sort(naturalSort)
    }

    if (catRows.length === 0 && files.length === 0) continue

    if (catRows.length !== files.length) {
      errors.push(
        `Categoría "${cat.slug}": hay ${catRows.length} fila(s) en el CSV pero ` +
        `${files.length} foto(s) en la carpeta de fotos de ${cat.slug}. Deben ser la misma cantidad.`
      )
      continue
    }

    catRows.forEach((row, idx) => {
      const num = String(idx + 1).padStart(2, '0')
      const originalFile = files[idx]
      const ext = extname(originalFile).toLowerCase()
      const finalName = `${cat.slug}-${num}${ext}`

      if (originalFile !== finalName) {
        renameSync(join(folderPath, originalFile), join(folderPath, finalName))
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
// fotos-originales/ (o public/products/), y vuelve a correr:  npm run generar-productos

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
  await generarPaginas(products)
}

await main()
