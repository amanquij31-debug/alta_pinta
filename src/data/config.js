// Edita aquí una sola vez: número de WhatsApp (formato internacional,
// sin +, sin espacios) e Instagram. Se usa en toda la página.
export const CONTACT = {
  whatsappNumber: '51900000000',
  instagram: 'https://instagram.com/altapinta',
}

export function whatsappLink(message) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
