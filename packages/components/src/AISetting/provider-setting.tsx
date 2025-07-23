'use client'

import { useState } from 'react'
import { EditIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useMySpace } from '@penx/hooks/useMySpace'
import { AIProvider } from '@penx/model-type'
import { store } from '@penx/store'
import { LLMProviderType } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Card, CardContent, CardHeader, CardTitle } from '@penx/uikit/card'
import { ProviderIcon } from './icons'
import { ProviderDropdownMenu } from './provider-dropdown-menu'
import { ProviderEditorDialog } from './provider-editor-dialog'

export function ProviderSetting() {
  const { space } = useMySpace()
  const providers = space?.props?.aiSetting?.providers || []

  // Track provider editing
  const [isEditing, setIsEditing] = useState(false)
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(
    null,
  )

  // Handle provider deletion
  const handleDeleteProvider = async (providerType: string) => {
    if (
      confirm(`Are you sure you want to delete the ${providerType} provider?`)
    ) {
      try {
        // Find the provider to remove
        const providerToRemove = providers.find(
          (p: AIProvider) => p.type === providerType,
        )
        if (providerToRemove) {
          await store.space.deleteAIProvider(providerType)
          toast.success(`${providerType} provider deleted successfully`)
        }
      } catch (error) {
        console.error('Failed to delete provider:', error)
        toast.error('Failed to delete provider')
      }
    }
  }

  // Handle edit provider
  const handleEditProvider = (provider: AIProvider) => {
    setEditingProvider(provider)
    setIsEditing(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          Your Providers
          <div className="ml-auto">
            <ProviderDropdownMenu />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {providers.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center">
            No providers added yet.
          </div>
        ) : (
          <div className="space-y-2">
            {providers.map((provider: AIProvider) => (
              <div
                key={provider.type}
                className="hover:bg-muted flex cursor-pointer flex-col rounded-md p-2"
                onClick={() => handleEditProvider(provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ProviderIcon
                      llmProviderType={provider.type as LLMProviderType}
                      className="mr-2"
                    />
                    <div className="flex flex-col">
                      <span>{provider.name || provider.type}</span>
                    </div>
                  </div>

                  {provider.availableModels &&
                    provider.availableModels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {provider.availableModels.map((model: string) => (
                          <Badge
                            key={model}
                            variant="outline"
                            className={` text-xs`}
                          >
                            {model}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit dialog */}
      {editingProvider && (
        <ProviderEditorDialog
          open={isEditing}
          onOpenChange={setIsEditing}
          providerType={editingProvider.type as LLMProviderType}
          existingProvider={editingProvider}
        />
      )}
    </Card>
  )
}
