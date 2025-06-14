import React from 'react'
import { PhoneLoginForm } from '@/components/Login/PhoneLoginForm'
import { PhonePinCodeForm } from '@/components/Login/PhonePinCodeForm'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'

export function PagePhoneLogin() {
  const { authStatus } = useAuthStatus()
  return (
    <MobileContent title={<Trans>Phone login</Trans>}>
      <div className="mt-[20vh] flex h-full w-full flex-col">
        {authStatus.type === 'login' && <PhoneLoginForm />}
        {authStatus.type === 'sms-code-sent' && (
          <PhonePinCodeForm></PhonePinCodeForm>
        )}
      </div>
    </MobileContent>
  )
}
