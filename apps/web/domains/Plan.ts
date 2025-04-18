import { editorDefaultValue, SECONDS_PER_DAY } from '@/lib/constants'
import { precision } from '@/lib/math'
import { FEE_RATE } from './Space'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days

export type PlanInfo = {
  name: string
  benefits: string
}

export type PlanRaw = {
  uri: string
  price: bigint
  isActive: boolean
}

export type PlanType = PlanRaw & PlanInfo

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Plan {
  constructor(
    public id: number,
    public raw: PlanType,
    private x: bigint,
    private y: bigint,
    private k: bigint,
  ) {}

  get uri() {
    return this.raw.uri
  }

  get name() {
    return this.raw.name
  }

  get benefits() {
    if (Array.isArray(this.raw?.benefits)) {
      return JSON.stringify(this.raw.benefits)
    }
    return JSON.stringify(editorDefaultValue)
  }

  get benefitsJson() {
    if (Array.isArray(this.raw.benefits)) return this.raw.benefits
    try {
      return JSON.parse(this.raw.benefits)
    } catch (error) {
      return editorDefaultValue
    }
  }

  get isActive() {
    return this.raw.isActive
  }

  get status() {
    return this.raw.isActive ? PlanStatus.ACTIVE : PlanStatus.INACTIVE
  }

  get subscriptionPrice() {
    return this.raw.price
  }

  get subscriptionPriceDecimal() {
    return precision.toDecimal(this.subscriptionPrice)
  }

  getUsdPrice(ethPrice: number) {
    return ethPrice * this.subscriptionPriceDecimal
  }

  getEthPricePerSecond() {
    const ethPricePerSecond = this.subscriptionPrice / SECONDS_PER_MONTH
    return ethPricePerSecond
  }

  /**
   * calculate the eth from subscription in a given duration
   * @param duration  duration by seconds
   * @returns
   */
  calEthByDuration(days: number | string) {
    const duration = BigInt(
      parseInt((Number(days) * Number(SECONDS_PER_DAY)).toString()),
    )
    const tokenPricePerSecond = this.getEthPricePerSecond()
    return duration * tokenPricePerSecond
  }

  calTokenByDuration(days: number | string) {
    const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
    const tokenPricePerSecond = this.getTokenPricePerSecond()
    return duration * tokenPricePerSecond
  }

  getTokenPricePerSecond() {
    const ethPricePerSecond = this.getEthPricePerSecond()
    const tokenAmount = this.getTokenAmount(ethPricePerSecond)
    return tokenAmount
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }
}
