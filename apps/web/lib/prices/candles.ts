import { div, times } from '../math'
import { Candle, Period, Trade } from '../types'
import { getCompleteTrades } from './getTrades'

export async function getCandlesData(
  tokenAddress: string,
  period: Period,
  limit: number,
): Promise<Candle[]> {
  // Convert period to seconds
  const secondsPeriod = periodToSeconds(period)
  // Current Unix timestamp in seconds
  const endTimestamp = Math.floor(Date.now() / 1000)
  // Nearest whole timestamp
  const nearestWholeTimestamp =
    Math.floor(endTimestamp / secondsPeriod) * secondsPeriod
  // Calculate start timestamp by going back (limit - 1) periods from the nearest whole timestamp
  const startTimestamp = nearestWholeTimestamp - secondsPeriod * (limit - 1)

  let trades: Trade[] = await getCompleteTrades(
    tokenAddress,
    startTimestamp,
    endTimestamp,
  )

  // Initialize the candles array
  const candles: Candle[] = initializeCandles(
    startTimestamp,
    secondsPeriod,
    limit,
  )

  // Process trades to populate candle data
  const lastPrice = populateCandleData(
    candles,
    trades,
    startTimestamp,
    secondsPeriod,
  )

  // Fill in missing candle data with the last known price
  fillMissingCandleData(candles, lastPrice)

  return candles.slice(-limit).reverse()
}

// Initialize the candles array
function initializeCandles(
  startTimestamp: number,
  secondsPeriod: number,
  limit: number,
): Candle[] {
  return Array.from({ length: limit }, (_, i) => ({
    timestamp: startTimestamp + i * secondsPeriod,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  }))
}

// Populate candle data based on trades
function populateCandleData(
  candles: Candle[],
  trades: Trade[],
  startTimestamp: number,
  secondsPeriod: number,
): number {
  let lastPrice = 0

  trades.forEach((trade) => {
    const tradeTime = Number(trade.timestamp)
    const ethAmount = Number(trade.ethAmount) // Convert ETH amount to proper value
    const tokenAmount = Number(trade.tokenAmount) // Convert token amount to proper value
    console.log('=====trade.tokenAmount:', trade.tokenAmount)

    if (tokenAmount === 0) return // Skip if token amount is zero

    // const tokenPrice = ethAmount / tokenAmount // Calculate token price
    const price = times(div(trade.ethAmount, trade.tokenAmount), 3600)
    console.log('=========price:', price.toString())

    const tokenPrice = price.toNumber()

    lastPrice = tokenPrice // Update last price

    const candleIndex = Math.floor((tradeTime - startTimestamp) / secondsPeriod)

    if (candleIndex >= 0 && candleIndex < candles.length) {
      const candle = candles[candleIndex]
      candle.open = candle.open === 0 ? tokenPrice : candle.open
      candle.high = Math.max(candle.high, tokenPrice)
      candle.low =
        candle.low === 0 ? tokenPrice : Math.min(candle.low, tokenPrice)
      candle.close = tokenPrice
    }
  })

  return lastPrice
}

// Fill missing candle data with the last known price
function fillMissingCandleData(candles: Candle[], lastPrice: number): void {
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i]

    // Check if the candle data is missing
    if (candle.high === 0 && candle.low === 0 && candle.close === 0) {
      if (lastPrice !== null) {
        candle.open = lastPrice
        candle.high = lastPrice
        candle.low = lastPrice
        candle.close = lastPrice
      }
    }
    // Update lastPrice to the current candle's close price
    lastPrice = candle.close
  }
}

// Convert period to seconds
function periodToSeconds(period: Period): number {
  const periodMap: Record<Period, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
  }

  const seconds = periodMap[period]
  if (seconds === undefined) {
    throw new Error(`Invalid period: ${period}`)
  }
  return seconds
}
