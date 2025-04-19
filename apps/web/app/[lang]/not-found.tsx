import { ROOT_DOMAIN } from '@penx/constants'
import Link from 'next/link'

export default function NotFound() {
  return (
    <html>
      <body>
        <div>
          <h2>Not Found</h2>
          <p>Could not find requested resource</p>
          <Link href={`https://${ROOT_DOMAIN}`}>Return Home</Link>
        </div>
      </body>
    </html>
  )
}
