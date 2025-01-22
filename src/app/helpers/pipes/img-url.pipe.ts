import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'imgUrl'
})

export class ImgUrlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    // if (!value) return null;
    if (value===null) return `/assets/img/placeholder-avatar.png`;
    return `https://icherniakov.ru/yt-course/${value}`;
  }

}
