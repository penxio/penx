import { GitHubAuthButton } from './GitHubAuthButton'
import { GithubConnectionBox } from './GitHubConnectionBox'
import { GitIntegration } from './GitIntegration'
import { useGitHubToken } from './useGitHubToken'

export const ConnectGitHub = () => {
  const { github, isTokenValid, isLoading } = useGitHubToken()

  return (
    <div>
      <div className="text-foreground/60 mb-6">
        Connect to you GitHub Repository, so you can backup data to GitHub
      </div>

      <GithubConnectionBox isLoading={isLoading}>
        {isTokenValid ? (
          <GitIntegration github={github!} />
        ) : (
          <GitHubAuthButton />
        )}
      </GithubConnectionBox>
    </div>
  )
}
