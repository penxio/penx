import { RESPACE_SUBGRAPH_URL } from '@/lib/constants'
import { lastTradeQuery, spaceTokenTradesQuery } from '@/lib/prices/prices-gql'
import { Trade } from '@/lib/types'
import { request } from 'graphql-request'

interface SpaceTokenTradesQueryResponse {
  trades: Trade[]
}

interface SpaceTokenTradeQueryResponse {
  trades: Trade
}

export async function getCompleteTrades(
  tokenAddress: string,
  startTimestamp: number,
  endTimestamp: number,
) {
  let allTrades: Trade[] = []
  let hasMoreTrades = true
  let emergencyStop = false
  let currentEndTimestamp = endTimestamp

  while (hasMoreTrades && !emergencyStop) {
    const trades = await getSpaceTokenTrades(
      tokenAddress,
      startTimestamp,
      currentEndTimestamp,
    )

    if (trades.length > 0) {
      allTrades = allTrades.concat(trades)
      currentEndTimestamp = Number(trades[trades.length - 1].timestamp)
      const firstTradeTimestamp = Number(trades[0].timestamp)
      if (firstTradeTimestamp == currentEndTimestamp) {
        console.warn(
          'Emergency stop triggered due to multiple trades with the same timestamp.',
        )
        emergencyStop = true
      }
    } else {
      hasMoreTrades = false
    }

    if (currentEndTimestamp <= startTimestamp) {
      hasMoreTrades = false
    }
  }

  const lastTradeResponse = await getlastTokenTrade(
    tokenAddress,
    startTimestamp,
  )

  if (lastTradeResponse.trades && Array.isArray(lastTradeResponse.trades)) {
    allTrades = allTrades.concat(lastTradeResponse.trades)
  }

  return allTrades
}

export async function getSpaceTokenTrades(
  tokenAddress: string,
  startTimestamp: number,
  endTimestamp: number,
) {
  const { trades = [] }: SpaceTokenTradesQueryResponse = await request({
    url: RESPACE_SUBGRAPH_URL,
    document: spaceTokenTradesQuery,
    variables: { tokenAddress, startTimestamp, endTimestamp },
  })
  return trades
}

export async function getlastTokenTrade(
  tokenAddress: string,
  borderTimestamp: number,
) {
  const trade: SpaceTokenTradeQueryResponse = await request({
    url: RESPACE_SUBGRAPH_URL,
    document: lastTradeQuery,
    variables: { tokenAddress, borderTimestamp },
  })
  return trade
}
