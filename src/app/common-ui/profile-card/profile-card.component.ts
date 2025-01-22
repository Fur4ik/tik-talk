import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Profile} from '../../data/interfaces/profile';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile-card',
  imports: [
    NgForOf,
    ImgUrlPipe,
    RouterLink
  ],
  templateUrl: './profile-card.component.html',
  standalone: true,
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile

}
