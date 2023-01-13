import { Directive, Input, Optional, HostBinding } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: '[showError]',
  standalone: true,
})
export class ShowErrorDirective {
  @Input() showError: string = '';
  @HostBinding('hidden') isHidden = true;

  constructor(@Optional() private controlContainer: ControlContainer) {}

  ngOnInit() {
    if (this.controlContainer) {
      const control = this.controlContainer.control!.get(this.showError);
      if (control) {
        control.valueChanges.subscribe(() => {
          this.isHidden = !(control.errors && control.touched);
        });
      }
    }
  }
}
