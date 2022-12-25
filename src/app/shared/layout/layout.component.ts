import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterButtonComponent } from 'src/app/shared/filter-button/filter-button.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FilterButtonComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  public toggle!: boolean;
}
