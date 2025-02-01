import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({
  standalone: true,
  name: 'timeAgo'
})

export class TimeAgoPipe implements PipeTransform {
  transform(value: any): any {

    value = DateTime.fromISO(value)
    const userOffset = DateTime.local().offset
    value = value.plus({minutes: userOffset});

    const currentTime = DateTime.now();
    const timeInSec = currentTime.diff(value).as('seconds');

    const timeInMin = timeInSec / 60

    if (timeInSec < 60) {
      return Math.round(timeInSec) + 's ago'
    } else if (timeInSec > 60 && timeInMin < 60) {
      return Math.round(timeInMin) + 'm ago'
    } else if (timeInMin > 60 && timeInMin < 1440) {
      return Math.round(timeInMin / 60) + 'h ago'
    } else if (timeInMin > 1440) {
      return Math.round(timeInMin / 1440) + 'd ago'
    }


  }

}
