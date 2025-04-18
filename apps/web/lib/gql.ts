import { gql } from 'graphql-request'

export const spacesQuery = gql`
  {
    spaces(first: 100, orderBy: "timestamp", orderDirection: "asc") {
      id
      spaceId
      address
      founder
      symbol
      name
      preBuyEthAmount
      ethVolume
      tokenVolume
      tradeCreatorFee
      uri
      memberCount
      members {
        id
        account
      }
    }
  }
`
