import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, HostListener, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'stack-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './stack-control.component.html',
  styleUrl: './stack-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StackControlComponent),
      multi: true
    }
  ]
})
export class StackControlComponent implements ControlValueAccessor {

  value$ = new BehaviorSubject<string[]>([])

  #disabled = false
  innerInput = ''

  onChange(stack: string[] | null): void {
  }

  onTouched() {
  }

  onClick(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    event.NONE
  }

  @HostBinding('class.disabled')
  get disabled() {
    return this.#disabled
  }

  @HostListener('keydown.enter')
  onEnter() {
    if (!this.innerInput) return

    this.value$.next([...this.value$.value, this.innerInput])
    this.innerInput = ''

    this.onChange(this.value$.value)
  }

  onTagDelete(index: number) {
    const tags = this.value$.value
    tags.splice(index, 1)
    this.value$.next(tags)

    this.onChange(this.value$.value)
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([])
      return
    }

    this.value$.next(stack)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.#disabled = isDisabled
  }
}
