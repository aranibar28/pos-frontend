import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[default-image]',
  standalone: true,
})
export class DefaultImageDirective {
  @Input('default-image') type: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const src = this.el.nativeElement.src;
    if (this.type && !src.endsWith('.webp')) {
      this.el.nativeElement.src = `assets/img/${this.type}.png`;
    }
  }

  @HostListener('error')
  defaultImage() {
    return (this.el.nativeElement.src = 'assets/img/default.webp');
  }
}
