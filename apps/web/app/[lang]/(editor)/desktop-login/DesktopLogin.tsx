'use client'

import React from 'react'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'

export function DesktopLogin() {
  // const { setIsOpen } = useLoginDialog()
  // const { session, isLoading } = useSession()
  // const searchParams = useSearchParams()
  // const token = searchParams?.get('token') as string
  // const { data } = useSession()

  // const { isPending: isCanceling, mutateAsync: cancel } =
  //   trpc.desktop.cancelLogin.useMutation()
  // const { isPending: isConfirming, mutateAsync: confirm } =
  //   trpc.desktop.confirmLogin.useMutation()

  // if (isLoading) {
  //   return (
  //     <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
  //       <LoadingDots className="bg-foreground" />
  //     </div>
  //   )
  // }

  // // if (!session) {
  // //   return (
  // //     <div className="bg-background flex h-screen flex-col items-center justify-center p-10">
  // //       <div className="mt-6 flex items-center justify-between gap-2">
  // //         <Button
  // //           size="lg"
  // //           className="w-32"
  // //           onClick={async () => {
  // //             setIsOpen(true)
  // //           }}
  // //         >
  // //           <Trans>Sign in</Trans>
  // //         </Button>
  // //       </div>
  // //     </div>
  // //   )
  // // }

  // return (
  //   <div className="flex h-screen flex-col items-center justify-center p-10">
  //     <div className="text-3xl font-bold">
  //       <Trans>Login to PenX desktop</Trans>
  //     </div>
  //     <div className="text-foreground/50">
  //       <Trans>Please confirm your authorization for this login.</Trans>
  //     </div>

  //     <div className="mt-6 flex items-center justify-between gap-2">
  //       <Button
  //         variant="outline"
  //         className="w-[160px] gap-2"
  //         disabled={isCanceling}
  //         onClick={async () => {
  //           if (isCanceling) return
  //           try {
  //             await cancel({ token })
  //             window.close()
  //           } catch (error) {
  //             toast.error('please try again')
  //           }
  //         }}
  //       >
  //         {isCanceling && <LoadingDots></LoadingDots>}
  //         <div>
  //           <Trans>Cancel</Trans>
  //         </div>
  //       </Button>
  //       <Button
  //         disabled={isConfirming}
  //         onClick={async () => {
  //           if (!data) {
  //             setIsOpen(true)
  //             return
  //           }
  //           try {
  //             await confirm({ token })
  //             fetch('http://localhost:14158/open-window')
  //             toast.success(<Trans>Desktop login successfully</Trans>)
  //             location.href = '/'
  //           } catch (error) {
  //             toast.error(<Trans>Please try again~</Trans>)
  //           }
  //         }}
  //       >
  //         {isConfirming && <LoadingDots></LoadingDots>}
  //         {session ? (
  //           <div>
  //             <Trans>Authorize desktop login</Trans>
  //           </div>
  //         ) : (
  //           <div>
  //             <Trans>Login</Trans>
  //           </div>
  //         )}
  //       </Button>
  //     </div>
  //   </div>
  // )
  return null
}
