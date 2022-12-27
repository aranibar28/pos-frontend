import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/common/alert.service';
import { ImagePipe } from 'src/app/pipes/image.pipe';
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
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ImagePipe,
  ],
  templateUrl: './image-dialog.component.html',
})
export class ImageDialogComponent {
  private dialogRef = inject(MatDialogRef<ImageDialogComponent>);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private data = inject(MAT_DIALOG_DATA);

  public file: File | undefined;
  public imgSelected: any = undefined;
  public imgCurrent: any = undefined;
  public load_btn: boolean = false;
  public disabled: boolean = true;
  public type: string = '';
  public id: string = '';

  ngOnInit(): void {
    const { data, type } = this.data;
    if (this.data) {
      this.imgSelected = data.image?.secure_url;
      this.imgCurrent = data.image?.secure_url;
      this.id = data._id;
      this.type = type;
    }
  }

  onSubmit() {
    this.load_btn = true;
    if (this.file) {
      const img = { image: this.file };
      this.productService.upload_image(this.id, this.type, img).subscribe({
        next: (res) => {
          this.load_btn = false;
          if (res.data) {
            this.alertService.success('Se subió la imagen correctamente.');
            this.dialogRef.close(true);
          } else {
            this.alertService.error(res.msg);
          }
        },
        error: (err) => {
          this.load_btn = false;
          console.log(err);
        },
      });
    } else {
      this.load_btn = false;
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  fileChanged(event: any) {
    const file: File = event.target.files[0];
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
}
