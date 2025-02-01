import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[popupDirective]'
})
export class PopupDirective {
  @Output() appClickOutside = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickDocument() {
    const targetElement = event!.target as HTMLElement;

    if(targetElement && !this.elementRef!.nativeElement.contains(targetElement)){
      this.appClickOutside.emit();
    }
  }
}
