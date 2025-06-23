import { Creation } from '@penx/domain'

export function sortTasks(creations: Creation[]) {
  return [...creations].sort((a, b) => Number(a.checked) - Number(b.checked))
}
