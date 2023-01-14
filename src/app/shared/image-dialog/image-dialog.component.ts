import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { UploadService } from 'src/app/common/upload.service';
import { AlertService } from 'src/app/common/alert.service';

import { DefaultImageDirective } from 'src/app/directives/default-image.directive';

import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    DefaultImageDirective,
  ],
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
})
export class ImageDialogComponent {
  private dialogRef = inject(MatDialogRef<ImageDialogComponent>);
  private productService = inject(UploadService);
  private alertService = inject(AlertService);
  private data = inject(MAT_DIALOG_DATA);

  public file: File | undefined;
  public imgSelected: any = undefined;
  public imgCurrent: any = undefined;
  public loadButton: boolean = false;
  public disabled: boolean = true;
  public title: string = '';
  public type: string = '';
  public id: string = '';

  ngOnInit(): void {
    const { data, type } = this.data;
    if (this.data) {
      this.imgSelected = data.image?.secure_url;
      this.imgCurrent = data.image?.secure_url;
      this.title = data.title;
      this.id = data._id;
      this.type = type;
    }
  }

  fileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File = input.files![0];
    const pattern: RegExp = /image-*/;
    const maxSize = 4000000;

    if (!this.isValidFile(file, pattern, maxSize)) {
      this.file = undefined;
      this.imgSelected = this.imgCurrent;
      this.disabled = true;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => (this.imgSelected = reader.result);
    this.disabled = false;
    this.file = file;
  }

  private isValidFile(file: File, pattern: RegExp, maxSize: number): boolean {
    if (!file) {
      return false;
    }
    if (file.size >= maxSize) {
      this.alertService.error('La imagen no puede superar los 4MB.');
      return false;
    }
    if (!file.type.match(pattern)) {
      this.alertService.error('El archivo debe ser una imagen.');
      return false;
    }
    return true;
  }

  onSubmit() {
    this.loadButton = true;
    if (this.file) {
      this.productService
        .upload_image(this.id, this.type, this.file)
        .subscribe({
          next: (res) => {
            this.loadButton = false;
            if (res.data) {
              this.alertService.success('Se subió la imagen correctamente.');
              this.dialogRef.close(true);
            } else {
              this.alertService.error(res.msg);
            }
          },
          error: (err) => {
            this.loadButton = false;
            console.log(err);
          },
        });
    } else {
      this.loadButton = false;
    }
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
