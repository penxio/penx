import { addDays, format } from 'date-fns'
import { TaskNav } from '@penx/constants'
import { Creation } from '@penx/domain'

export function getTasksByTaskNav(creations: Creation[], taskNav: string) {
  if (taskNav === TaskNav.TODAY) {
    return creations.filter((c) => c.date === format(new Date(), 'yyyy-MM-dd'))
  }

  if (taskNav === TaskNav.TOMORROW) {
    return creations.filter(
      (c) => c.date === format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    )
  }

  if (taskNav === TaskNav.UPCOMING) {
    return creations.filter(
      (c) =>
        new Date(c.date).getTime() >
        new Date(format(new Date(), 'yyyy-MM-dd')).getTime(),
    )
  }
  return creations
}
