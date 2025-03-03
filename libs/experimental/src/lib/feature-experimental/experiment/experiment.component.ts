import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ReactiveFormComponent } from '../reactive-form/reactive-form.component'
import { TestComponent } from '../test/test.component'
import { ChangeDetectionComponent } from '../change-detection/change-detection.component'

@Component({
  selector: 'app-experiment',
  imports: [ChangeDetectionComponent],
  templateUrl: './experiment.component.html',
  standalone: true,
  styleUrl: './experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentComponent {}
