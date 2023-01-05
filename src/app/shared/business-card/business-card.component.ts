import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Business } from '../../utils/intefaces';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-card.component.html',
})
export class BusinessCardComponent {
  private authService = inject(AuthService);
  public company: Business = this.authService.company;
}
