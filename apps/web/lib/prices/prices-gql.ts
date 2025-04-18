import { gql } from 'graphql-request'

export const spaceTokenTradesQuery = gql`
  query listTrades(
    $tokenAddress: String!
    $startTimestamp: Int!
    $endTimestamp: Int!
  ) {
    trades(
      orderBy: "timestamp"
      orderDirection: "desc"
      where: {
        space_: { id: $tokenAddress }
        timestamp_gte: $startTimestamp
        timestamp_lt: $endTimestamp
      }
    ) {
      id
      type
      account
      ethAmount
      tokenAmount
      timestamp
    }
  }
`

export const lastTradeQuery = gql`
  query lastTrade($tokenAddress: String!, $borderTimestamp: Int!) {
    trades(
      first: 1
      orderBy: "timestamp"
      orderDirection: "desc"
      where: { space_: { id: $tokenAddress }, timestamp_lt: $borderTimestamp }
    ) {
      id
      type
      account
      ethAmount
      tokenAmount
      timestamp
    }
  }
`
