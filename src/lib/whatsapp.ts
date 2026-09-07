export function whatsappLink(phoneDigits: string, message: string): string {
  const clean = phoneDigits.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
