export function toBase64(str: string) {
  try {
    const bytes = new TextEncoder().encode(str)
    const encodedString = btoa(String.fromCharCode.apply(null, bytes as any))
    return encodedString
  } catch (error) {
    return ''
  }
}
