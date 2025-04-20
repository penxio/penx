// import { emitter } from '@/lib/event'
import { Command } from './types'

export const commands: Command[] = [
  {
    id: 'add-node',
    name: 'Add node',
    handler: () => {
      // emitter.emit('ADD_NODE')
    },
  },

  {
    id: 'export-to-markdown',
    name: 'export to markdown',
    handler: () => {
      // emitter.emit('ADD_NODE')
    },
  },
]
