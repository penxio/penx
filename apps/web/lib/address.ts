import { NETWORK, NetworkNames } from './constants'

const baseSepoliaAddress = {
  SpaceFactory: '0x2728B1E9cEf2d2278EB7C951a553D0E5a6aE45d0',
  CreationFactory: '0xB2ebC5f85E0DA834CB71884150d2Fd738fEf918B',
  PenToken: '0x114E58DcEea1C5a8B2fa03eC6AC0c236A5F6cD92',
  Tip: '0x7928C53d2D85ac25326b54D7C0E40c7458938E33',
  DailyClaim: '0x05970db4279700106C170a8d8503c97C80e05eD6',
  TokenVesting: '0xD99DfE0013b742E4bD3dE0d6e94a9f7Eb24b93BC',
  Member: '0xA8A8b310C482652AbC24266D84CA734CD90c21C3',
}

const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  CreationFactory: '0xB9563EBeDE644956FB4d8EFE40440bAeA8da342D',
  PenToken: '0x0708eA842bd28c8C1eAD1Ca3c1a62e83EE433cd7',
  Tip: '0xa83D1edb468C872FF997C4C0c7F1471ad0B3526B',
  DailyClaim: '0x65DEdAb13f58EF2255aD0e6BA5FBa95f827eF955',
  TokenVesting: '0x19a957098a9d273B8EA3dF26f8f8aFF81FCfdFd2',
  Member: '0x47a209356EFF76321639C1C311e301409Fb0a18F',
}

export const addressMap: Record<keyof typeof baseSepoliaAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.BASE_SEPOLIA) {
      return baseSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE) {
      return baseAddress
    }
    return baseAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
