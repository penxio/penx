import { Agent, Mastra } from '@mastra/core'
import { LanguageModelV1 } from 'ai'

interface ChatAgentConfig {
  model: LanguageModelV1
  useTool?: boolean
  useRag?: boolean
}

function getChatAgent(config: ChatAgentConfig) {
  const customTools = config.useTool ? {} : {}

  const agent = new Agent({
    name: 'PenX Chat Agent',
    instructions:
      'You are a chat agent named PenX AI Assistant that can answer questions and help with tasks',
    model: config.model,
    tools: customTools,
  })

  const mastra = new Mastra({
    agents: { agent },
  })

  return agent
}

export default getChatAgent
