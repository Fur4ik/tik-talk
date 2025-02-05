import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core'
import { ProfileService } from '../../data/services/profile.service'
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-message-input',
  imports: [ImgUrlPipe, FormsModule],
  templateUrl: './message-input.component.html',
  standalone: true,
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2)
  profile = inject(ProfileService).me()

  isCommentInput = input(false)
  postId = input<number>(0)

  @Output() created = new EventEmitter<string>()

  oldInputText = input<string>()

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  elRef = inject(ElementRef)

  @HostListener('window:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault()
    this.onCreate()

    // this.r2.setStyle(this.elRef.nativeElement, 'height', '78px');
  }

  inputText: string | undefined = ''

  constructor() {
    effect(() => {
      this.inputText = this.oldInputText()
    })
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement

    this.r2.setStyle(textarea, 'height', 'auto')
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
  }

  onCreate() {
    if (!this.inputText) return
    this.created.emit(this.inputText)
    this.inputText = ''
  }
}
