import {
  Anthropic,
  DeepSeek,
  Google,
  OpenAI,
  Perplexity,
  XAI,
} from '@lobehub/icons'
import { LLMProviderType, LLMProviderTypeEnum } from '@penx/types'

interface ProviderIconProps {
  llmProviderType: LLMProviderType
  className?: string
  size?: number
}

export function ProviderIcon({
  llmProviderType,
  className = '',
  size,
}: ProviderIconProps) {
  const sizeClass = size ? `size-${size}` : 'size-4'
  const defaultClass = `${sizeClass} ${className}`

  switch (llmProviderType) {
    case LLMProviderTypeEnum.ANTHROPIC:
      return <Anthropic className={defaultClass} />
    case LLMProviderTypeEnum.DEEPSEEK:
      return <DeepSeek className={defaultClass} />
    case LLMProviderTypeEnum.GOOGLE:
      return <Google className={defaultClass} />
    case LLMProviderTypeEnum.OPENAI:
      return <OpenAI className={defaultClass} />
    case LLMProviderTypeEnum.OPENAI_COMPATIBLE:
      return <OpenAI className={defaultClass} />
    case LLMProviderTypeEnum.PERPLEXITY:
      return <Perplexity className={defaultClass} />
    case LLMProviderTypeEnum.XAI:
      return <XAI className={defaultClass} />
    default:
      return null
  }
}

interface ProviderTitleProps {
  llmProviderType: LLMProviderType
  className?: string
  iconClassName?: string
}

export function ProviderTitle({
  llmProviderType,
  className = '',
  iconClassName = 'mr-2',
}: ProviderTitleProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ProviderIcon
        llmProviderType={llmProviderType}
        className={iconClassName}
      />
      <span>{llmProviderType}</span>
    </div>
  )
}
