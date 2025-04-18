import Big from 'big.js'

export function plus(...args: Big.BigSource[]) {
  const [value, ...rest] = args
  let big = new Big(value)
  for (const item of rest) {
    big = big.plus(item)
  }
  return big
}

export function minus(value: Big.BigSource, ...args: Big.BigSource[]) {
  let big = new Big(value)
  for (const item of args) {
    big = big.minus(item)
  }
  return big
}

export function times(value: Big.BigSource, ...args: Big.BigSource[]) {
  let big = new Big(value)
  for (const item of args) {
    big = big.times(item)
  }
  return big
}

export function div(value: Big.BigSource, ...args: Big.BigSource[]) {
  let big = new Big(value)
  for (const item of args) {
    big = big.div(item)
  }
  return big
}
