import { Component } from '@angular/core'
import { ReactiveFormComponent } from '../reactive-form/reactive-form.component'
import { TestComponent } from '../test/test.component'

@Component({
  selector: 'app-experiment',
  imports: [TestComponent],
  templateUrl: './experiment.component.html',
  standalone: true,
  styleUrl: './experiment.component.scss',
})
export class ExperimentComponent {}
