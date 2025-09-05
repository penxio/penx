import { useEffect, useState } from 'react'
import { Login } from '@/components/Login'
import { ThemeProvider } from '@/components/ThemeProvider'
import { useSession } from '@/hooks/useSession'
import { storage } from '@/lib/storage'
import { browser, storage as wxtStorage } from '#imports'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LocaleProvider } from '@penx/locales'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/card'
import { LoadingDots } from '@penx/uikit/loading-dots'

function SidePanelContent() {
  const { session, isLoading, refetch } = useSession()

  useEffect(() => {
    const unwatchSession = wxtStorage.watch<number>(
      storage.keys.session,
      (newValue, oldValue) => {
        refetch()
        console.log(
          '>>>>>>======session changed in side panel',
          newValue,
          'oldValue:',
          oldValue,
        )
      },
    )

    return () => {
      unwatchSession()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingDots className="bg-foreground"></LoadingDots>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Login />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">PenX Side Panel</h1>
        <Badge variant="secondary">Active</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your most used features from the side panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => {
              window.close()
            }}
          >
            close
          </Button>
          <Button className="w-full justify-start" variant="outline">
            🔍 Search
          </Button>
          <Button className="w-full justify-start" variant="outline">
            📊 Dashboard
          </Button>
          <Button className="w-full justify-start" variant="outline">
            ⚙️ Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest notes and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Created new note 2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Updated dashboard 1 hour ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span>Shared workspace 3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1"></div>

      <Card>
        <CardContent className="pt-4">
          <div className="text-muted-foreground text-center text-sm">
            <p>Welcome back, {session.user?.email}</p>
            <p className="text-xs">Last active: Just now</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider className="flex h-screen w-full flex-col">
        <DashboardProviders>
          <SidePanelContent />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
