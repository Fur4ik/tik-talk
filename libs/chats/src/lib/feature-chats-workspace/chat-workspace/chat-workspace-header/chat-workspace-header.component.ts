import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ImgUrlPipe } from '@tt/common-ui'
import { Profile } from '@tt/interfaces/profile'

@Component({
  selector: 'app-chat-workspace-header',
  imports: [RouterLink, ImgUrlPipe],
  templateUrl: './chat-workspace-header.component.html',
  standalone: true,
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input<Profile>()
}
