export function formatTagName(name = '') {
  return name.trim().replace(/\s+/g, '-').toLowerCase()
}
