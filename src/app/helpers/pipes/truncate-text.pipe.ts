import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'truncateText'
})

export class TruncateTextPipe implements PipeTransform {
  transform(value: string, maxWidth: number): string {
    if(value.length>30)
      return value.substring(0,30) + '...' + maxWidth;

    return value
  }
}
