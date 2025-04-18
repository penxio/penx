import { Deprecate } from './types/deprecate'
import { WarnedPositions } from './types/warned-positions'

const warnedPositions: WarnedPositions = {}

function deprecate(data: Deprecate) {
  const stack = new Error().stack || ''
  let at = (stack.match(/(?:\s+at\s.+){2}\s+at\s(.+)/) || [undefined, ''])[1]

  if (!at) {
    throw new Error('Regex error')
  }
  if (/\)$/.test(at)) {
    const res = at.match(/[^(]+(?=\)$)/)
    if (res) {
      ;[at] = res
    }
  } else {
    at = at.trim()
  }
  if (at in warnedPositions) {
    return
  }
  warnedPositions[at] = true
  let message
  switch (data.type) {
    case 'class':
      message = 'Class'
      break
    case 'property':
      message = 'Property'
      break
    case 'option':
      message = 'Option'
      break
    case 'method':
      message = 'Method'
      break
    case 'function':
      message = 'Function'
      break
    default:
      message = data.type || ''
  }
  message += ` \`${data.name}\` has been deprecated`
  if (data.version) {
    message += ` since version ${data.version}`
  }
  if (data.alternative) {
    message += `, use \`${data.alternative}\` instead`
  }
  message += '.'
  if (at) {
    message += `\n    at ${at}`
  }

  console.warn(message) // eslint-disable-line no-console
}

export default deprecate
