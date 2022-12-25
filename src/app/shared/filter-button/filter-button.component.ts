import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent {
  @Output() switch = new EventEmitter<boolean>();
  public toggle = localStorage.getItem('toggle') == 'true' ? true : false;

  ngOnInit(): void {
    this.switch.emit(this.toggle);
  }

  onChange() {
    this.toggle = !this.toggle;
    localStorage.setItem('toggle', this.toggle ? 'true' : 'false');
    this.switch.emit(this.toggle);
  }
}
