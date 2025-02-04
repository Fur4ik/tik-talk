import {Component, Input} from '@angular/core';
import {Profile} from '../../../data/interfaces/profile';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-subscriber-card',
  imports: [
    ImgUrlPipe,
    RouterLink
  ],
  templateUrl: './subscriber-card.component.html',
  standalone: true,
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile!: Profile


}
