import { DataStreamWriter, tool } from 'ai'
import { z } from 'zod'
import { uniqueId } from '@penx/unique-id'

// import {
//   artifactKinds,
//   documentHandlersByArtifactKind,
// } from '../../../artifacts/server'

type Session = any

interface CreateDocumentProps {
  session: Session
  dataStream: DataStreamWriter
}

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({} as any)
