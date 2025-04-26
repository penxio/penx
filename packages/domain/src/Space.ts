import { editorDefaultValue, IPFS_GATEWAY, STATIC_URL } from '@penx/constants'
import { precision } from '@penx/math'
import { SpaceType } from '@penx/types'
import { Address } from 'viem'

export const FEE_RATE = BigInt(1) // 1%

export class Space {
  constructor(public raw: SpaceType) {}

  get x() {
    return BigInt(this.raw.x)
  }

  get y() {
    return BigInt(this.raw.y)
  }

  get k() {
    return BigInt(this.raw.k)
  }

  get id() {
    return this.raw.address
  }

  get name() {
    return this.raw.name
  }

  get totalSupply() {
    return this.raw.totalSupply
  }

  get totalSupplyDecimal() {
    return precision.toDecimal(this.totalSupply)
  }

  get totalSupplyFormatted() {
    return this.totalSupplyDecimal.toFixed(2)
  }

  get ethVolume() {
    return BigInt(this.raw.ethVolume)
  }

  get ethVolumeDecimal() {
    return precision.toDecimal(this.ethVolume)
  }

  get ethVolumeFormatted() {
    return this.ethVolumeDecimal.toFixed(4)
  }

  get memberCount() {
    return this.raw.memberCount
  }

  get stakingRevenuePercent() {
    return BigInt(this.raw.stakingRevenuePercent)
  }

  get siteUrl() {
    return ''
  }

  get description() {
    return this.raw.description
  }

  get about() {
    return this.raw.about
  }

  get aboutJson() {
    try {
      return JSON.parse(this.raw.about)
    } catch (error) {
      return editorDefaultValue
    }
  }

  get symbolName() {
    return this.raw.symbol
  }

  get logo() {
    const { logo } = this.raw
    if (!logo) return ''
    if (logo.startsWith('http')) return logo

    if (logo.startsWith('/')) {
      return STATIC_URL + logo
    }
    return IPFS_GATEWAY + `/ipfs/${logo}`
  }

  get address() {
    return this.raw.address
  }

  get founder() {
    return this.raw.founder
  }

  get spaceInfo() {
    return {
      name: this.name,
      description: this.description,
      about: this.about,
      logo: this.logo.split('/').pop(),
      subdomain: this.raw.subdomain,
    }
  }

  isFounder = (account: Address) => {
    return this.raw.founder.toLowerCase() === account?.toLowerCase()
  }

  getUsdVolume(ethPrice: number) {
    const usdVolume = this.ethVolumeDecimal * ethPrice
    return {
      usdVolume,
      usdVolumeFormatted: '$' + usdVolume.toFixed(2),
    }
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }

  getEthAmount(tokenAmount: bigint) {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = this.y + tokenAmountAfterFee
    const newX = this.k / newY
    const ethAmount = this.x - newX
    return ethAmount
  }
}
