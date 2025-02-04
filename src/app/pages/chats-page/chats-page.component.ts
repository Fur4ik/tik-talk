import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsListComponent} from './chats-list/chats-list.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-chats-page',
  imports: [
    RouterOutlet,
    ChatsListComponent,
  ],
  templateUrl: './chats-page.component.html',
  standalone: true,
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {
  cookieService = inject(CookieService);

  startX = 0
  chatListWidth = Number( this.cookieService.get('chatListWidth'));

  isResizing = false;

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.startX = event.clientX;

  }

  ngOnInit() {
    if (this.chatListWidth===0) this.chatListWidth = 250
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    const controlWidth = this.chatListWidth + event.clientX - this.startX

    if(controlWidth >= 250 && controlWidth <= 400) {
      this.chatListWidth += event.clientX - this.startX;
    }
    this.startX = event.clientX;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;

    this.cookieService.delete('chatListWidth')
    this.cookieService.set('chatListWidth',`${this.chatListWidth}` );
  }
}
