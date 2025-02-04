import {Component, ElementRef, HostBinding, HostListener, inject, Renderer2, ViewChild} from '@angular/core';
import {ChatsBtnComponent} from './chats-btn/chats-btn.component';
import {ChatService} from '../../../data/services/chat.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, map, startWith, switchMap, takeUntil, tap, timer} from 'rxjs';

@Component({
  selector: 'app-chats-list',
  imports: [ChatsBtnComponent, AsyncPipe, RouterLinkActive, RouterLink, ReactiveFormsModule],
  templateUrl: './chats-list.component.html',
  standalone: true,
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
  chatService = inject(ChatService);
  r2 = inject(Renderer2)

  @ViewChild('messagesWrapper') messagesWrapper!: ElementRef;

  filteredChats = new FormControl('')

  inputValueLength = 0

  chats$ = timer(0,5000)
    .pipe(
      switchMap(()=> this.chatService.getMyChats()),
      switchMap(chat => {
        return this.filteredChats.valueChanges.pipe(
          startWith(''),
          map(inputValue => {
            return chat.filter(chat => {
              this.inputValueLength = inputValue!.length;
              return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
                .toLowerCase()
                .includes(inputValue!.toLowerCase() ?? '')
            })
          })
        )
      })
    )

  onClearFilter(){
    this.filteredChats.setValue('')
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeWindow()
  }

  ngAfterViewInit() {
    this.resizeWindow()
  }

  resizeWindow(){
    const {top} = this.messagesWrapper.nativeElement.getBoundingClientRect();
    const wrapperHeight = window.innerHeight - top - 28

    this.r2.setStyle(this.messagesWrapper.nativeElement, 'height', `${wrapperHeight}px`);
  }
}
