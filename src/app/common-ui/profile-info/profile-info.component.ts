import {Component, Input} from '@angular/core';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {Profile} from '../../data/interfaces/profile';

@Component({
  selector: 'app-profile-info',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './profile-info.component.html',
  standalone: true,
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent {
  @Input() profile!: Profile;
}
