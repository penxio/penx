import { BACKGROUND_EVENTS } from '@penx/constants'

interface IScreenShotOptions {
  width: number
  height: number
  x: number
  y: number
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function screenShot(
  options: IScreenShotOptions,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, rejected) => {
    chrome.runtime.sendMessage(
      {
        type: BACKGROUND_EVENTS.SCREEN_SHOT,
        payload: {},
      },
      (base64) => {
        try {
          const image = new Image()
          image.src = base64
          image.onload = () => {
            const imageWidthRatio = image.width / window.innerWidth
            const imageHeightRatio = image.height / window.innerHeight
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            /**
             * Set the coordinates, width and height of the interception area
             */
            // The x-coordinate of the upper left corner of the area
            const x = options.x * imageWidthRatio
            // The y coordinate of the upper left corner of the area
            const y = options.y * imageHeightRatio
            // area width
            const width = options.width * imageWidthRatio
            // area height
            const height = options.height * imageHeightRatio
            // Draw the intercepted area on canvas
            canvas.width = width
            canvas.height = height
            context?.drawImage(image, x, y, width, height, 0, 0, width, height)

            resolve(canvas)
          }
        } catch (error) {
          rejected(error)
        }
      },
    )
  })
}
