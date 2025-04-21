export const getEmptyElement = (type = 'p', text = '') => {
  return {
    type,
    children: [{ text }],
  }
}
