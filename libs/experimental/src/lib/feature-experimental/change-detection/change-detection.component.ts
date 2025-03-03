import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core'

@Component({
  selector: 'app-change-detection',
  imports: [],
  templateUrl: './change-detection.component.html',
  styleUrl: './change-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDetectionComponent {
  numberOfTicks = 0

  numbers: number[] = []

  ctr = inject(ChangeDetectorRef)

  constructor() {

    setInterval(() => {
      this.numberOfTicks ++

      this.numbers.push(this.numberOfTicks)

      console.log(this.numbers)

      if(this.numberOfTicks % 2 === 0){
        this.ctr.reattach()
      } else{
        this.ctr.detach()
      }

      this.ctr.markForCheck()
    }, 1000)


  }
}
