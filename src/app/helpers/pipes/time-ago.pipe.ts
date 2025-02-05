import { Pipe, PipeTransform } from '@angular/core'
import { DateTime } from 'luxon'

@Pipe({
  standalone: true,
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, type?: string): any {
    if (value === null || value === undefined) return ''

    if (type === 'date') {
      const now = DateTime.now()
      if (
        value[0] === now.day &&
        value[1] === now.month &&
        value[2] === now.year
      ) {
        return 'Сегодня'
      }
      const months = ['', 'Января', 'Февраля', 'Марта', 'Апреля']
      if (value[2] === now.year) {
        return `${value[0]} ${months[value[1]]}`
      }
      return `${value[0]}.${value[1]}.${value[2]}`
    }

    value = DateTime.fromISO(value)
    const userOffset = DateTime.local().offset
    const ISOTime = value.plus({ minutes: userOffset })

    const currentTime = DateTime.now()
    const diffTime = currentTime.diff(ISOTime)
    const timeInSec = diffTime.as('seconds')

    const timeInMin = timeInSec / 60

    if (type === 'message') {
      return ISOTime.toFormat('HH:mm')
    }

    if (timeInSec < 60) {
      return Math.round(timeInSec) + ' с назад'
    } else if (timeInSec > 60 && timeInMin < 60) {
      return Math.round(timeInMin) + ' м назад'
    } else if (timeInMin > 60 && timeInMin < 1440) {
      return Math.round(timeInMin / 60) + ' ч назад'
    } else if (timeInMin / 60 / 24 > 1 && timeInMin / 60 / 24 <= 7) {
      return Math.round(timeInMin / 60 / 24) + ' д назад'
    } else if (timeInMin / 60 / 24 > 7) {
      return ISOTime.toFormat('HH:mm dd-MM-yyyy')
    }
  }
}
