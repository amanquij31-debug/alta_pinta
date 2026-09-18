// Edita aquí una sola vez: número de WhatsApp (formato internacional,
// sin +, sin espacios) e Instagram. Se usa en toda la página.
export const CONTACT = {
  whatsappNumber: '51979329219',
  instagram: 'https://www.instagram.com/importodo.peru?stkn=MTFxM3A0eDcybm8yYg==',
}

export function whatsappLink(message) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
