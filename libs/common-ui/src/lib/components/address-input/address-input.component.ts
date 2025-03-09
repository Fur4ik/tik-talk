import { ChangeDetectionStrategy, Component, forwardRef, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { DadataService } from '@tt/common-ui'
import { debounceTime, firstValueFrom, map, switchMap, tap } from 'rxjs'
import { DadataSuggestions } from '../data/interfaces/dadata-suggestions.interface'

@Component({
  selector: 'address-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  #dadataService = inject(DadataService)

  isDropdownOpened = signal<boolean>(false)
  innerSearchControl = new FormControl()

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
    apartment: new FormControl('')
  })

  suggestion$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(val => {
        return this.#dadataService.getSuggestion(val)
      })
    )

  onInputClick() {
    this.isDropdownOpened.set(true)
  }

  onSuggestion(address: DadataSuggestions) {
    this.innerSearchControl.patchValue(address.value)

    const addressData = address.data

    this.addressForm.patchValue({
      city: ` ${addressData.city_with_type ?? ''} ${addressData.settlement_with_type ?? ''}`.trim(),
      street: addressData.street_with_type,
      building: `${addressData.house_type} ${addressData.house} ${addressData.block_type ?? ''} ${addressData.block ?? ''}`,
      apartment: `${addressData.flat_type ?? ''} ${addressData.flat ?? ''}`
    })


    this.onChange(address.value)
    this.isDropdownOpened.set(false)
  }

  constructor() {
    this.addressForm.valueChanges.subscribe(val => {
      this.onChange(String(Object.values(val)).replaceAll(',', ', '))
    })
  }

  writeValue(address: string) {
    const addressReplased = address.replaceAll(',', ', ')
    this.innerSearchControl.patchValue(addressReplased, { emitEvent: false })

    let addressData = address.split(', ')
    if (addressData.length === 1) addressData = address.split(',')


    this.addressForm.patchValue({
      city: addressData[0] || '',
      street: addressData[1] || '',
      building: addressData[2] || '',
      apartment: addressData[3] || ''
    })
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.innerSearchControl.disable() : this.innerSearchControl.enable()
    isDisabled ? this.addressForm.disable() : this.addressForm.enable()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onChange(val: any) {
  }

  onTouched() {
  }
}
