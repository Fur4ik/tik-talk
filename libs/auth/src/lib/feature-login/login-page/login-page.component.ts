import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@tt/auth'

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  authService = inject(AuthService)
  router = inject(Router)

  passwordVisible = signal<boolean>(false)

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  })

  onSubmit(event: Event) {
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigateByUrl('')
      })
    }
  }

  protected readonly window = window
}
