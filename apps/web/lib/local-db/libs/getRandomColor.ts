export function getColorNames(postfix = '500') {
  // const keys = Object.keys(colors).filter(
  //   (i) =>
  //     i.endsWith(postfix) &&
  //     !/gray|slate|zinc|neutral|stone/i.test(i.toLowerCase()),
  // )

  // return keys
  return []
}

export function getRandomColor(postfix = '500'): string {
  const keys = getColorNames(postfix)
  const index = Math.floor(Math.random() * keys.length)

  return keys[index]!
}
