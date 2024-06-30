export function formatName(name = '') {
  return name.trim().replace(/\s+/g, '-').toLowerCase()
}

export function upFirst(s: string = '') {
  return s.replace(/^[a-z]/, (g) => g.toUpperCase())
}
