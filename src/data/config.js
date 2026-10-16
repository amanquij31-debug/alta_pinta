// Edita aquí una sola vez: número de WhatsApp (formato internacional,
// sin +, sin espacios), Instagram y la dirección del sitio. Se usa en toda
// la página y también en el script que genera las páginas de producto.
export const CONTACT = {
  whatsappNumber: '51979329219',
  instagram: 'https://www.instagram.com/importodo.peru?stkn=MTFxM3A0eDcybm8yYg==',
}

// Si el primo compra un dominio propio, cámbialo solo aquí y vuelve a correr
// `npm run generar-productos`.
export const SITE_URL = 'https://altapinta-ivory.vercel.app'

export function whatsappLink(message) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// Link directo a la página de un producto (la crea el script generar-productos).
export function productUrl(id) {
  return `${SITE_URL}/p/${id}.html`
}

// Mensaje que se envía por WhatsApp al consultar un producto.
export function productMessage(product) {
  return `Hola, me interesa "${product.name}": ${productUrl(product.id)}`
}
