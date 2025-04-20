import { Button } from '@penx/uikit/ui/button'
import { Card, CardContent, CardHeader } from '@penx/uikit/ui/card'
import { Link } from '@penx/libs/i18n'
import { CheckCircle2 } from 'lucide-react'

type SearchParams = Promise<{ email?: string }>

export default async function UnsubscribedPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams

  return (
    <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center justify-center">
        <Card className="flex max-w-[420px] flex-col items-center p-6">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center text-2xl font-semibold">
                Unsubscribed Successfully
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="text-muted-foreground text-center">
              {searchParams.email ? (
                <>
                  <span className="text-foreground font-medium">
                    {searchParams.email}
                  </span>{' '}
                  has been unsubscribed from our newsletter.
                </>
              ) : (
                'You have been unsubscribed from our newsletter.'
              )}
            </div>
            <div className="text-muted-foreground text-center text-sm">
              You can always resubscribe if you change your mind.
            </div>
            <Button asChild className="mt-2">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
