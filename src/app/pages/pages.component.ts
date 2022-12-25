import { AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardComponent],
  templateUrl: './pages.component.html',
})
export class PagesComponent implements AfterContentChecked {
  private cdref = inject(ChangeDetectorRef);

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
