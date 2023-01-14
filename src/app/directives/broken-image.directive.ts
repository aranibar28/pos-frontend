import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appBrokenImage]',
  standalone: true,
})
export class BrokenImageDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('error')
  chargeImageDefault() {
    const element = this.elementRef.nativeElement;
    element.src = 'assets/img/not-found.webp';
  }
}
