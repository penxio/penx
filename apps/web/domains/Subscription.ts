import { toFloorFixed } from '@penx/utils'

export type SubscriptionRaw = {
  planId: number
  account: string
  startTime: bigint
  duration: bigint
  amount: bigint
}

const SECONDS_PER_DAY = 86400

export class Subscription {
  constructor(public raw: SubscriptionRaw) {}

  get planId() {
    return this.raw.planId
  }

  get start() {
    return this.raw.startTime
  }

  get duration() {
    return this.raw.duration
  }

  get amount() {
    return this.raw.amount
  }

  get remainDuration() {
    if (this.duration === BigInt(0)) return BigInt(0)
    const remain =
      this.start + this.duration - BigInt(Math.floor(Date.now() / 1000))
    return remain >= 0 ? remain : BigInt(0)
  }

  get remainAmount() {
    if (this.duration === BigInt(0)) return BigInt(0)
    return (this.amount * this.remainDuration) / this.duration
  }

  get daysDecimal() {
    return Number(this.remainDuration) / SECONDS_PER_DAY
  }

  get daysFormatted() {
    return toFloorFixed(Number(this.remainDuration) / SECONDS_PER_DAY, 2)
  }

  get timeFormatted() {
    if (this.duration === BigInt(0)) return '0 hours'
    const seconds = Number(this.remainDuration)
    const secondsInAnHour = 3600
    const secondsInADay = SECONDS_PER_DAY
    const secondsInAMonth = 2592000

    const days = seconds / secondsInADay
    // return `${toFloorFixed(days, 2)} days`

    if (seconds < secondsInADay) {
      const hours = seconds / secondsInAnHour
      return `${toFloorFixed(hours, 2)} hours`
    } else {
      const days = seconds / secondsInADay
      return `${toFloorFixed(days, 2)} days`
    }
  }

  get isMember() {
    return this.remainDuration > 0
  }

  getAmountByDays(days: number | string) {
    const seconds = BigInt(
      parseInt((Number(days) * SECONDS_PER_DAY).toString()),
    )
    if (this.remainDuration === BigInt(0)) return BigInt(0)
    return (this.remainAmount * seconds) / this.remainDuration
  }
}
