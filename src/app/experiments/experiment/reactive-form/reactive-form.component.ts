import { Component, inject } from '@angular/core'
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MockService } from './mock.service'
import { KeyValuePipe } from '@angular/common'

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

interface Address {
  city?: string,
  street?: string,
  building?: number,
  apartment?: number,
}

interface Feature {
  code: string,
  label: string,
  value: boolean,
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null)
  })
}

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.scss',
  standalone: true
})
export class ReactiveFormComponent {
  mockService = inject(MockService)
  ReceiverType = ReceiverType
  features: Feature[] = []

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    firstName: new FormControl<string>(''),
    inn: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({})
  })

  constructor() {
    this.mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addresses => {
          this.form.controls.addresses.clear()
          for (const address of addresses) {
            this.form.controls.addresses.push(getAddressForm(address))

          }
        }
      )

    this.mockService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features

        for (const feature of features) {
          this.form.controls.feature
            .addControl(feature.code, new FormControl(feature.value))
        }
      })

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.form.controls.inn.clearValidators()

        if (value === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([Validators.required, Validators.minLength(10)])
        }
        console.log(value)
      })
  }


  onSubmit(event: SubmitEvent) {
    console.log(this.form.valid)
    console.log(this.form.value)
  }

  addAddress() {
    this.form.controls.addresses
      .push(
        getAddressForm(),
      {emitEvent: false}
      )
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, {emitEvent: false})
  }

  sort = ()=> 0
}
