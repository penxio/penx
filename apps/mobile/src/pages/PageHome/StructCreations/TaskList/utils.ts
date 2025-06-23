import { addDays, format } from 'date-fns'
import { Creation } from '@penx/domain'

export enum SectionType {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  UPCOMING = 'UPCOMING',
  ALL = 'ALL',
}

export function getCreations(creations: Creation[], section: string) {
  if (section === SectionType.TODAY) {
    return creations.filter((c) => c.date === format(new Date(), 'yyyy-MM-dd'))
  }

  if (section === SectionType.TOMORROW) {
    return creations.filter(
      (c) => c.date === format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    )
  }

  if (section === SectionType.UPCOMING) {
    return creations.filter(
      (c) =>
        new Date(c.date).getTime() >
        new Date(format(new Date(), 'yyyy-MM-dd')).getTime(),
    )
  }
  return creations
}
