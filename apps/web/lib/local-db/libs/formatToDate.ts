import { format } from 'date-fns'

export function formatToDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
