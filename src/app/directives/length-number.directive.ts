import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[lengthNumber]',
  standalone: true,
})
export class LengthNumberDirective {
  @Input('lengthNumber') length: number = 0;
  @Input('typeLetter') type: string = '';

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    this.onlyNumber(event);
  }

  onlyNumber(event: KeyboardEvent) {
    const regex = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(event.key) || inputElement.value.length >= this.length) {
      event.preventDefault();
    }

    if (this.type && inputElement.value.length === 0) {
      inputElement.value = this.type;
    }
  }
}
