import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'tt-input',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> TtInputComponent),
      multi: true
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {
  type = input<'text' | 'password'>('text')
  placeholder = input<string>('')

  onChange: any
  onTouched: any

  value: string | null = null
  disabled = signal<boolean>(false)

  writeValue(val: string | null): void {
    this.value = val
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled)
  }

  onModelChange(val: string | null): void {
    this.onChange(val)
  }
}
