import { precision } from '@/lib/math'
import { Address } from 'viem'

export type CreationRaw = {
  id: bigint
  creator: Address
  appId: bigint
  uri: string
  farmer: number
  curve: {
    basePrice: bigint
    inflectionPoint: number
    inflectionPrice: bigint
    linearPriceSlope: bigint
  }
  balance: bigint
  volume: bigint
}
export class Creation {
  constructor(
    public raw: CreationRaw,
    public supply: bigint,
  ) {}

  get id() {
    return this.raw.id
  }

  get idDecimal() {
    return Number(this.id)
  }

  get idString() {
    return String(this.id)
  }

  get appId() {
    return this.raw.appId
  }

  get appIdDecimal() {
    return Number(this.appId)
  }

  get creator() {
    return this.raw.creator
  }

  get volume() {
    return this.raw.volume
  }

  get tvl() {
    return this.raw.balance
  }

  get tvlFormatted() {
    return precision.toDecimal(this.tvl).toFixed(5)
  }

  get curve() {
    return this.raw.curve
  }

  get curveNumberFormat() {
    return {
      basePrice: Number(this.curve.basePrice),
      inflectionPoint: Number(this.curve.inflectionPoint),
      inflectionPrice: Number(this.curve.inflectionPrice),
      linearPriceSlope: Number(this.curve.linearPriceSlope),
    }
  }

  get supplyDecimal() {
    return Number(this.supply)
  }
}
