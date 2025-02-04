import {Directive, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appTruncateText]'
})
export class TruncateTextDirective implements OnInit, OnDestroy {
  elRef = inject(ElementRef);
  r2 = inject(Renderer2);

  resizeObserver: ResizeObserver | null = null;

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(()=>{
      this.maxWidthText()
    })
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.elRef.nativeElement);
    }
  }

  maxWidthText(){
    const maxWidth = this.elRef.nativeElement.offsetWidth;
    console.log('Max Width:', maxWidth); // Для отладки
    this.r2.setAttribute(this.elRef, 'data-max-width', maxWidth);
  }
}
