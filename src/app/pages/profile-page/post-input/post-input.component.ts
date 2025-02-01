import {Component, EventEmitter, HostBinding, inject, input, Input, Output, Renderer2} from '@angular/core';
import {ProfileService} from '../../../data/services/profile.service';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url.pipe';
import {PostService} from '../../../data/services/post.service';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-post-input',
  imports: [
    ImgUrlPipe,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  standalone: true,
  styleUrl: './post-input.component.scss'
})

export class PostInputComponent {
  r2 = inject(Renderer2)
  profile = inject(ProfileService).me()
  postService = inject(PostService);

  isCommentInput = input(false)
  postId = input<number>(0)

  @Output() created = new EventEmitter()

  @HostBinding('class.comment')
  get isComment(){
    return this.isCommentInput()
  }

  postText = ''

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return

    if(this.isCommentInput()){
      firstValueFrom(this.postService.createComment({
        text: this.postText,
        authorId: this.profile!.id,
        postId: this.postId()
      })).then(()=> {
          this.postText = ''
          this.created.emit()
        }
      )
      return;
    }

    firstValueFrom(this.postService.createPost({
      title: 'Это мой пост',
      content: this.postText,
      authorId: this.profile!.id,
      communityId: 0
    })).then(()=>
      this.postText=''
    )
  }




}
