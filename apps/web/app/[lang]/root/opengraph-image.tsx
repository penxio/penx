import { ImageResponse } from 'next/og'

export const alt = 'Build your own Digital Garden'

export const revalidate = 60

export const size = {
  width: 1200,
  height: 600,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center relative text-white leading-none bg-black"
        style={
          {
            // backgroundImage: 'url(https://frame.penx.io/og-bg.png)',
            // backgroundSize: 'cover',
            // backgroundPosition: 'bottom center',
          }
        }
      >
        <h1 tw="text-8xl -mt-6 leading-none">PenX</h1>
        <div tw="text-3xl leading-none">Build your own Digital Garden</div>
      </div>
    ),
    {
      ...size,
    },
  )
}
