'use client'

import { PropsWithChildren } from 'react'
import { Trans } from '@lingui/react'
import { useCreations } from '@penx/hooks/useCreations'
import { useMySite } from '@penx/hooks/useMySite'
import { AIProviderType } from '@penx/model-type'
import { store } from '@penx/store'
import { Panel } from '@penx/types'
import { Card, CardContent, CardHeader, CardTitle } from '@penx/uikit/card'
import { Input } from '@penx/uikit/input'
import { Switch } from '@penx/uikit/switch'
import { uniqueId } from '@penx/unique-id'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelAIProviders({ panel, index }: Props) {
  const { creations: data } = useCreations()
  const { site } = useMySite()
  const providers = site.aiProviders || []

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>AI providers</div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="h-full flex-col overflow-auto px-4 pb-20 pt-10">
        <div className="space-y-5">
          {Object.keys(AIProviderType).map((type) => {
            const provider = providers.find((p) => p.type === type)!
            return (
              <Card key={type}>
                <CardHeader className="">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {type === AIProviderType.ANTHROPIC && (
                      <>
                        <span className="icon-[ri--anthropic-fill] size-4"></span>
                        <span>Anthropic</span>
                      </>
                    )}
                    {type === AIProviderType.DEEPSEEK && (
                      <>
                        <span className="icon-[arcticons--deepseek] size-5"></span>
                        <span>DeepSeek</span>
                      </>
                    )}
                    {type === AIProviderType.GOOGLE_AI && (
                      <>
                        <span className="icon-[mdi--google] size-4"></span>
                        <span>Google AI</span>
                      </>
                    )}
                    {type === AIProviderType.OPENAI && (
                      <>
                        <span className="icon-[ri--openai-fill] size-4 "></span>
                        <span>OpenAI</span>
                      </>
                    )}
                    {type === AIProviderType.PERPLEXITY && (
                      <>
                        <span className="icon-[ri--perplexity-fill] size-5"></span>
                        <span>Perplexity</span>
                      </>
                    )}
                    {type === AIProviderType.XAI && (
                      <>
                        <CardTitle className="flex items-center gap-2">
                          <span>xAI</span>
                        </CardTitle>
                      </>
                    )}
                    <div className="ml-auto">
                      <Switch
                        checked={!!provider?.enabled}
                        onCheckedChange={(v) => {
                          store.site.updateAIProvider({
                            type: type as AIProviderType,
                            enabled: v,
                          })
                        }}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Field>
                    <Label>API key</Label>
                    <Input
                      placeholder="API key"
                      defaultValue={provider?.apiKey || ''}
                      onChange={(e) => {
                        store.site.updateAIProvider({
                          type: type as AIProviderType,
                          apiKey: e.target.value,
                        })
                      }}
                    />
                  </Field>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

function Field({ children }: PropsWithChildren) {
  return <div className="space-y-1">{children}</div>
}

function Label({ children }: PropsWithChildren) {
  return <div className="text-sm">{children}</div>
}
