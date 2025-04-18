import { CheckCircle2 } from 'lucide-react'
import { Metadata } from 'next'

type SearchParams = Promise<{ email?: string; site?: string }>

export const metadata: Metadata = {
  title: 'Subscription Confirmed',
  description: 'Your email subscription has been confirmed',
}

export default async function NewsletterConfirmedPage(props: {
  searchParams: SearchParams
}) {
  const { email, site } = await props.searchParams

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-[640px] flex-col items-center justify-center px-8">
      <div className="w-full rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>

        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
          Subscription Confirmed
        </h1>

        <div className="space-y-3">
          <p className="text-gray-600">
            Thank you for confirming your subscription
            {site ? ` to ${site}` : ''}.
          </p>
          {email && (
            <p className="text-sm text-gray-500">
              We'll send newsletters to:{' '}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          )}
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </a>
        </div>
      </div>
    </div>
  )
}
