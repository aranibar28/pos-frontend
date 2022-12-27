// Shared Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StatusPipe } from 'src/app/pipes/status.pipe';
import { ImagePipe } from 'src/app/pipes/image.pipe';

// Angular Material Dashboard Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// Angular Material Modules
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';

// Angular Material Translate
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEsPaginatorIntl } from '../utils/paginator-intl';
import { MatDialogModule } from '@angular/material/dialog';

export const SHARED_MODULES = [
  CommonModule,
  ReactiveFormsModule,
  RouterModule,
  NgxSpinnerModule,
];

export const TABLE_MODULES = [
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatChipsModule,
  MatSortModule,
  StatusPipe,
  ImagePipe,
];

export const FORMS_MODULES = [
  MatDialogModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatSelectModule,
];

export const DASHBOARD_MODULES = [
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
];

export const TRANSLATE_PAGINATOR = {
  provide: MatPaginatorIntl,
  useValue: getEsPaginatorIntl(),
};
