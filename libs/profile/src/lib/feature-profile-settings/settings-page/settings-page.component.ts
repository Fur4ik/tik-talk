import { ChangeDetectionStrategy, Component, effect, forwardRef, inject, ViewChild } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProfileService } from '../../data'
import { firstValueFrom } from 'rxjs'
import { AvatarUploadComponent, ProfileInfoComponent } from '../../ui'
import { Router } from '@angular/router'
import { AuthService } from '@tt/auth'
import { GlobalStoreService } from '@tt/data-access/global-store'
import { AddressInputComponent, StackControlComponent } from '@tt/common-ui'

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule, AvatarUploadComponent, ProfileInfoComponent, StackControlComponent, AddressInputComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  profileService = inject(ProfileService)
  authService = inject(AuthService)
  router = inject(Router)
  #globalStorageService = inject(GlobalStoreService)

  profile = this.#globalStorageService.me

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

  fb = new FormBuilder()

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    // stack: [{value: '', disabled: true }],
    city: [''],
  })

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profile(),
      })
    })
  }

  onSave() {
    this.form.markAsTouched()
    this.form.updateValueAndValidity()

    if (this.form.invalid) return

    if (this.avatarUploader.avatar) {
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }
    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    )
  }

  onCancel() {
    // @ts-ignore
    this.form.patchValue(this.profile())
  }

  onLogout() {
    this.authService.logout()
  }
}
