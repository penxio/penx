import { getCandlesData } from '@/lib/prices/candles'
import { Candle, Period } from '@/lib/types'
import { NextResponse } from 'next/server'

// Define the return type for the GET function
type GetResponse =
  | NextResponse<{ error: string }>
  | NextResponse<{ period: Period; candles: Candle[] }>

/**
 * Handles GET requests for fetching candle data based on the provided parameters.
 *
 * @param {Request} req - The incoming request object containing query parameters.
 * @returns {Promise<NextResponse>} - A response object containing the candle data or error messages.
 * examples:
 * 1. http://localhost:4000/api/prices/candles?tokenAddress=0xace966d383de6663ff21a67bc0c9a35574ee4978&period=15m&limit=5000
 * 2. http://localhost:4000/api/prices/candles?tokenAddress=0xace966d383de6663ff21a67bc0c9a35574ee4978&period=1h&limit=300
 */
export async function GET(req: Request): Promise<GetResponse> {
  const url = new URL(req.url)
  const tokenAddress = url.searchParams.get('tokenAddress') || ''
  const period = url.searchParams.get('period') as Period
  const limit = parseInt(url.searchParams.get('limit') || '1')

  if (!tokenAddress) {
    return NextResponse.json(
      { error: 'tokenAddress is required.' },
      { status: 400 },
    )
  }

  if (!period) {
    return NextResponse.json({ error: 'period is required.' }, { status: 400 })
  }

  const validPeriods: Period[] = ['1m', '5m', '15m', '1h', '4h', '1d']
  if (!validPeriods.includes(period)) {
    return NextResponse.json(
      {
        error: `Invalid period. Allowed values are: ${validPeriods.join(', ')}.`,
      },
      { status: 400 },
    )
  }

  if (isNaN(limit) || limit <= 0 || limit > 5000) {
    return NextResponse.json(
      {
        error:
          'Invalid limit. It must be a positive number and cannot exceed 5000.',
      },
      { status: 400 },
    )
  }

  const candles = await getCandlesData(tokenAddress, period, limit)

  return NextResponse.json({
    period: period,
    candles: candles,
  })
}
