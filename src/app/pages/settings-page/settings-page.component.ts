import {Component, effect, inject, signal, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../data/services/profile.service';
import {AuthService} from '../../auth/auth.service';
import {firstValueFrom} from 'rxjs';
import {AvatarUploadComponent} from './avatar-upload/avatar-upload.component';
import {Router} from '@angular/router';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ProfileInfoComponent} from '../../common-ui/profile-info/profile-info.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    ReactiveFormsModule,
    AvatarUploadComponent,
    AsyncPipe,
    ProfileInfoComponent,
    NgForOf
  ],
  templateUrl: './settings-page.component.html',
  standalone: true,
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  router = inject(Router);

  profile$ = toObservable(this.profileService.me)

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  fb = new FormBuilder();

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
  })


  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
          ...this.profileService.me(),
          stack: this.mergeStack(this.profileService.me()?.stack)
        })
      }
    )
  }


  onSave() {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return

    if(this.avatarUploader.avatar)
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))

    firstValueFrom(
    //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack)
      })
    )
  }

  splitStack(stack: string | string[] | null | undefined): string[] {
    if (!stack) return []
    if(Array.isArray(stack)) return stack

    return stack.split(',')
  }

  mergeStack(stack: string | string[] | null | undefined): string {
    if(!stack) return ''
    if(Array.isArray(stack)) return stack.join(',')

    return stack
  }


  onCancel() {
    // @ts-ignore
    this.form.patchValue(this.profileService.me())
  }

  onLogout() {
    this.authService.logout();
  }


}

