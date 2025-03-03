import { Component, computed, inject, signal } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  FormSubmittedEvent,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { KeyValuePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { MockService, NameValidator } from '../../data'

enum WorkoutType {
  BASIC = 'BASIC',
  POWER = 'POWER',
  ENDURANCE = 'ENDURANCE',
}

interface Training {
  name: string
  type: WorkoutType
}

interface PhysicalFeatures {
  code: string
  label: string
  value: boolean
}

interface Trainer {
  name: string
  workoutType: WorkoutType
}

function validatorFirstUpCase(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
      ? { startsWith: { message: `${forbiddenLetter} - запрещено` } }
      : null
  }
}

function getTrainingSession() {
  return new FormGroup({
    date: new FormControl<number | null>(null, Validators.required),
    time: new FormControl<string>('', Validators.required),
    type: new FormControl<string>('', Validators.required),
    trainer: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    extra: new FormRecord({}),
  })
}

@Component({
  selector: 'app-test',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
})
export class TestComponent {
  mockService = inject(MockService)
  nameValidator = inject(NameValidator)

  WorkoutType = WorkoutType
  physicalFeatures: PhysicalFeatures[] = []
  trainings: Training[] = []
  trainers: Trainer[] = []
  trainingTime: string[] = []

  http = inject(HttpClient)

  workoutForm = new FormGroup({
    firstName: new FormControl<string>('', {
      validators: [Validators.required, Validators.pattern(/^[а-яА-Я]+$/), validatorFirstUpCase('я')],
      asyncValidators: this.nameValidator.validate.bind(this.nameValidator),
      updateOn: 'blur',
    }),
    lastName: new FormControl<string>('', [Validators.required, Validators.pattern(/^[а-яА-Я]+$/)]),
    phone: new FormControl<string>('+7', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]),
    physicalFeatures: new FormRecord({}),
    trainingSession: new FormArray([getTrainingSession()]),
  })

  constructor() {
    // firstValueFrom(this.http.get<any>(`/yt-course/community/`))

    this.workoutForm.controls.trainingSession.clear()

    this.mockService
      .getTrainingAndType()
      .pipe(takeUntilDestroyed())
      .subscribe((trainings) => {
        this.trainings = trainings
      })

    this.mockService
      .getWorkoutFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((workoutFeatures) => {
        this.physicalFeatures = workoutFeatures
        for (const feature of workoutFeatures) {
          this.workoutForm.controls.physicalFeatures.addControl(feature.code, new FormControl(feature.value))
        }
      })

    this.mockService
      .getTrainers()
      .pipe(takeUntilDestroyed())
      .subscribe((trainers) => {
        this.trainers = trainers
      })

    this.mockService
      .getTrainingTime()
      .pipe(takeUntilDestroyed())
      .subscribe((trainingTime) => {
        this.trainingTime = trainingTime
      })
  }

  addTraining() {
    this.workoutForm.controls.trainingSession.push(getTrainingSession())
    this.workoutForm.markAsUntouched()
  }

  deleteTraining(index: number) {
    this.workoutForm.controls.trainingSession.removeAt(index)
    this.workoutForm.markAsUntouched()
  }

  isInvalid(control: FormControl) {
    return control.touched && control.invalid
  }

  get error() {
    if (
      this.isInvalid(this.workoutForm.controls.firstName) ||
      this.isInvalid(this.workoutForm.controls.lastName) ||
      this.isInvalid(this.workoutForm.controls.phone)
    )
      return 'Заполните свои данные'.toString()

    if (
      this.workoutForm.controls.firstName.valid &&
      this.workoutForm.controls.lastName.valid &&
      this.workoutForm.controls.phone.valid &&
      this.workoutForm.controls.trainingSession.length === 0 &&
      this.workoutForm.controls.trainingSession.touched
    )
      return 'Добавьте тренировку'.toString()

    if (this.workoutForm.controls.trainingSession.touched && this.workoutForm.controls.trainingSession.invalid)
      return 'Заполните данные тренировки'
    return ''
  }

  onSubmit(event: FormSubmittedEvent) {
    this.workoutForm.markAllAsTouched()
    if (this.workoutForm.invalid) return
    console.log(this.workoutForm.value)
  }

  phoneInput(event: any) {
    let input = event.target.value.replace(/\D/g, '')
    if (input.length > 1)
      input = `+7 (${input.slice(1, 4)}) ${input.slice(4, 7)}-${input.slice(7, 9)}-${input.slice(9, 11)}`
    event.target.value = input
    this.workoutForm.controls.phone.setValue(input, { emitEvent: false })
  }

  preventDelete(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement
    if (target.selectionStart! <= 3 && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault()
    }
  }

  sort = () => 0
}
