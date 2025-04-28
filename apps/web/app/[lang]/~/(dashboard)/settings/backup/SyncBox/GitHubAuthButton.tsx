import { useEffect, useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSession } from '@penx/session'
import { Github } from '@penx/components/theme-ui/SocialIcon/icons'
import { Button } from '@penx/uikit/button'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function GitHubAuthButton() {
  const [loading, setLoading] = useState(false)
  const { data } = useSession()

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      size="lg"
      className="w-52 gap-x-2"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        const baseURL = process.env.NEXT_PUBLIC_ROOT_HOST

        const callbackURL = `${baseURL}/api/github-oauth`
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${data?.userId}&redirect_uri=${callbackURL}`
        console.log('url======>>>>>>>:', url)

        location.href = url
      }}
    >
      {loading ? (
        <LoadingDots className="bg-background" />
      ) : (
        <>
          <Github className="fill-background h-4 w-4" />
          <div>Connect GitHub</div>
        </>
      )}
    </Button>
  )
}
