import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[format-number]',
  standalone: true,
})
export class FormatNumberDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('blur') onBlur() {
    if (!this.el.value) {
      this.el.value = '1.00';
    } else if (!this.el.value.includes('.')) {
      this.el.value += '.00';
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      return;
    }
    if (event.key === '.' && this.el.value.indexOf('.') > -1) {
      event.preventDefault();
    }
    if (!((event.key >= '0' && event.key <= '9') || event.key === '.')) {
      event.preventDefault();
    }
  }
}
