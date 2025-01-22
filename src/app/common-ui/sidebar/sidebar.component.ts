import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import {Profile} from '../../data/interfaces/profile';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    AsyncPipe,
    SubscriberCardComponent,
    NgForOf,
    NgIf,
    ImgUrlPipe,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService);

  me = this.profileService.me

  subscribers$ = this.profileService.getSubscribersShortList()

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }




}
