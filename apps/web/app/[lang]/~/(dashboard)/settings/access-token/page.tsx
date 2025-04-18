import { CreateTokenForm } from './CreateTokenForm'
import AccessTokenList from './TokenList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex flex-col justify-between space-y-8">
      <AccessTokenList />
      <CreateTokenForm />
    </div>
  )
}
