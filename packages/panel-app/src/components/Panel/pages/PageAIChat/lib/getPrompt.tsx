interface Reference {
  nodeId: string
  structId: string
  structName: string
  header: string
  content: string
}

export function getPrompt(query: string, references: Reference[]) {
  const refTexts = references.map((i) => i.content).join('\n---------------\n')

  // console.log('======refTexts:', refTexts)

  return `
You are an expert assistant specialized in providing accurate answers based solely on the provided reference documents. Your task is to answer the user’s question using only the given information. Follow these rules exactly:

1. Base your answer only on the reference documents.
2. If the references lack the necessary information, respond with “No relevant information found.”
3. Structure your answer clearly and concisely.
4. Use bullet points or numbered lists when presenting multiple points.
5. Respond in the same language as the user’s question.
6. Do not add unrelated content or speculation.

Reference documents:
${refTexts}

User question:
${query}

Begin your answer below:
  `.trim()
}
