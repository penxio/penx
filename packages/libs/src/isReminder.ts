import { isDate } from 'date-fns'

export type ReminderState = {
  date?: Date
  repeat: string
}

export function isReminder(value: any): value is ReminderState {
  return !!value?.date && !!value.repeat && isDate(value?.date)
}
