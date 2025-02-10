import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

enum WorkoutType {
  BASIC = 'BASIC',
  POWER = 'POWER',
  ENDURANCE = 'ENDURANCE',
}

@Injectable({
  providedIn: 'root',
})
export class MockService {
  getAddresses() {
    return of([
      {
        city: 'Москва',
        street: 'Юности',
        building: 5,
        apartment: 47,
      },
      {
        city: 'Сургут',
        street: 'Крылова',
        building: 53,
        apartment: 133,
      },
    ])
  }

  getFeatures() {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true,
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true,
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
    ])
  }

  getTrainingAndType() {
    return of([
      {
        name: 'Базовая тренировка',
        type: WorkoutType.BASIC,
      },
      {
        name: 'Силовая тренировка',
        type: WorkoutType.POWER,
      },
      {
        name: 'Тренировка на выносливость',
        type: WorkoutType.ENDURANCE,
      },
    ])
  }

  getTrainers() {
    return of([
      {
        name: 'Юрий Липовецкий',
        workoutType: WorkoutType.BASIC,
      },
      {
        name: 'Астафуров Максим',
        workoutType: WorkoutType.POWER,
      },
      {
        name: 'Александра Егорова',
        workoutType: WorkoutType.POWER,
      },
      {
        name: 'Илья Живот',
        workoutType: WorkoutType.ENDURANCE,
      },
      {
        name: 'Роман Рыбаков',
        workoutType: WorkoutType.ENDURANCE,
      },
    ])
  }

  getWorkoutFeatures() {
    return of([
      {
        code: 'experience',
        label: 'Опыт',
        value: false,
      },
      {
        code: 'developments',
        label: 'Собственные наработки',
        value: false,
      },
      {
        code: 'injury',
        label: 'Травма',
        value: false,
      },
    ])
  }

  getTrainingTime() {
    return of(['30:00', '45:00', '60:00', '90:00'])
  }

  getExtra() {
    return of([])
  }
}
