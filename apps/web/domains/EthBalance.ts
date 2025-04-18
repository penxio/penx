import { precision } from '@/lib/math'

export class EthBalance {
  constructor(private _value: bigint) {}

  get value() {
    return this._value
  }

  get valueDecimal() {
    return precision.toDecimal(this.value)
  }

  get valueFormatted() {
    return this.valueDecimal.toFixed(4)
  }
}
