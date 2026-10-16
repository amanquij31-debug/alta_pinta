# Alta Pinta — Catálogo

Catálogo web (solo frontend) para la marca Alta Pinta: gorros, morrales,
mochilas, billeteras y bandoleras.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Cómo agregar o actualizar productos

Ya no hace falta escribir el nombre de archivo de cada foto. El sistema
empareja automáticamente cada fila del CSV con las fotos de su categoría,
**en el mismo orden** en que aparecen.

1. **Llena `productos.csv`** (o la plantilla de Excel) con 3 columnas:
   `categoria`, `nombre`, `descripcion`. Agrupa las filas por categoría.
2. **Sube las fotos** de cada categoría a `public/products/<categoria>/`,
   en el mismo orden en que escribiste las filas de esa categoría. El
   nombre del archivo no importa — el script las renombra solo.
3. **La cantidad debe coincidir**: si en "gorros" hay 5 filas, debe haber
   exactamente 5 fotos en `public/products/gorros/`. Si no coinciden, el
   script te dice en qué categoría está el desfase.
4. **Corre el generador:**
   ```bash
   npm run generar-productos
   ```
5. **Revisa en local** con `npm run dev`, y si todo se ve bien, sube:
   ```bash
   git add .
   git commit -m "Agregar productos nuevos"
   git push
   ```
   Vercel despliega automáticamente en cada push.

## Comprimir fotos

Usa [squoosh.app](https://squoosh.app) (gratis, sin instalar nada):
sube la foto, elige formato WebP, calidad ~75-80%, descarga. Con 100+
fotos por categoría, esto es clave para que el sitio cargue rápido.

## Editar el número de WhatsApp / Instagram

Abre `src/data/config.js` y cambia `whatsappNumber` (formato internacional,
solo números, sin `+`) e `instagram`. Se actualiza automáticamente en todos
los botones "Consultar por WhatsApp" y en la sección de contacto.

## Estructura

```
src/
  components/   NavBar, Hero, ProductCard, ProductGrid, ContactSection, SearchBar
  pages/        Home, Category, Search
  data/
    config.js     número de WhatsApp e Instagram (edítalo una sola vez aquí)
    products.js   GENERADO por el script — no lo edites a mano
public/
  logo.png
  products/
    gorros/ morrales/ mochilas/ billeteras/ bandoleras/
productos.csv   categoria, nombre, descripcion — una fila por producto
scripts/
  generar-productos.js   empareja el CSV con las fotos y genera products.js
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Catálogo Alta Pinta"
git branch -M main
git remote add origin <URL_DE_TU_REPO>
git push -u origin main
```

## Desplegar en Vercel

1. Entra a vercel.com e importa el repositorio de GitHub.
2. Framework preset: **Vite** (se detecta automático).
3. Build command: `npm run build` — Output directory: `dist`.
4. Deploy. Cada push a `main` vuelve a desplegar automáticamente.

## Fotos: compresión automática (recomendado)

Con ~400 productos, las fotos del celular (3-5 MB c/u) harían el sitio muy lento.
Por eso el script puede comprimirlas solo:

1. Una sola vez: `npm install` (instala `sharp`).
2. Pon las fotos **tal cual las tomaste** en `fotos-originales/<categoria>/`
   (esa carpeta no se sube a GitHub). Mismo orden que las filas del CSV.
3. Corre `npm run generar-productos`. Las reduce (máx. 1000 px, webp) y las
   guarda en `public/products/<categoria>/`. Solo procesa las nuevas.
4. **Agrega productos nuevos siempre al final** de cada categoría en el CSV y
   en las fotos, para que los links ya compartidos no cambien.

Si una categoría NO tiene carpeta en `fotos-originales/`, el script usa las fotos
que estén directo en `public/products/<categoria>/` (sin comprimir).

## Links de producto para WhatsApp

Cada vez que corres `npm run generar-productos` también se crea una página por
producto en `public/p/<id>.html` (ej. `/p/gorros-1.html`) con foto, nombre y
descripción. El botón "Consultar por WhatsApp" envía ese link en el mensaje y
WhatsApp muestra la foto como vista previa. Si cambias de dominio, edita
`SITE_URL` en `src/data/config.js` y vuelve a correr el script.

## Dónde editar textos

- `src/data/content.js`: "Sobre nosotros", pasos de "Cómo comprar" y horario
  (el horario no se muestra mientras esté vacío).
- `src/data/config.js`: WhatsApp, Instagram y `SITE_URL`.
- Foto de fondo del inicio: `src/styles/hero.css` (clase `.hero__bg`).
