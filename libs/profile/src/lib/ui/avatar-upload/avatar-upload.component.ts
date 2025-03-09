import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core'
import { DndDirective, ImgUrlPipe } from '@tt/common-ui'
import { GlobalStoreService } from '@tt/data-access/global-store'
import { Profile } from '@tt/data-access/profile'

@Component({
  selector: 'app-avatar-upload',
  imports: [DndDirective],
  templateUrl: './avatar-upload.component.html',
  standalone: true,
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {

  #globalStorageService = inject(GlobalStoreService)

  profileAvatar = this.#globalStorageService.me()?.avatarUrl ?
    `/yt-course/${this.#globalStorageService.me()?.avatarUrl}` :
    '/assets/img/placeholder-avatar.png'

  preview = signal<string>(this.profileAvatar)

  avatar: File | null = null

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    this.processFile(file)
  }

  onFileDropped(file: File) {
    this.processFile(file)
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }
    reader.readAsDataURL(file)

    this.avatar = file
  }
}
