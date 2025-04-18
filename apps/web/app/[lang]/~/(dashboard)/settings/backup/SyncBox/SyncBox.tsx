import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="mb-3 text-3xl font-bold">Github backup</div>
      </div>
      <div>
        <ConnectGitHub />
      </div>
    </div>
  )
}
