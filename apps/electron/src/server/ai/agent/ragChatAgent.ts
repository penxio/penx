import { Agent, Mastra } from '@mastra/core'
import { PGVECTOR_PROMPT } from '@mastra/rag'
import { LanguageModelV1 } from 'ai'
import { vectorQueryTool } from '../tools/vectorQueryTool'

interface ChatAgentConfig {
  model: LanguageModelV1
  useTool?: boolean
  useRag?: boolean
}

function getRagChatAgent(config: ChatAgentConfig) {
  const agent = new Agent({
    name: 'PenX RAG Chat Agent',
    instructions: `
    Process queries using the provided context. Structure responses to be concise and relevant.
    ${PGVECTOR_PROMPT}
   `,
    model: config.model,
    tools: { vectorQueryTool },
  })

  const mastra = new Mastra({
    agents: { agent },
  })

  return agent
}

export default getRagChatAgent
