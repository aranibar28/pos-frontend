import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { SaleService } from 'src/app/services/sale.service';
import { Details } from 'src/app/utils/intefaces';
import { ImagePipe } from 'src/app/pipes/image.pipe';
import { MatListModule } from '@angular/material/list';
import { PurchaseService } from 'src/app/services/purchase.service';
const columns = ['image', 'product', 'quantity', 'price', 'subtotal'];

@Component({
  selector: 'app-details-purchase',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatListModule, ImagePipe],
  templateUrl: './details-purchase.component.html',
})
export class DetailsPurchaseComponent {
  private dialogRef = inject(MatDialogRef<DetailsPurchaseComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);
  private purchaseService = inject(PurchaseService);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Details[]>;
  public data: any = {};

  ngOnInit(): void {
    this.data = this.dialogData;
    setTimeout(() => {
      this.purchaseService.read_purchase_by_id(this.data._id).subscribe({
        next: (res) => {
          res.details.map((item: any) => {
            item.image = item.product.image?.secure_url;
            item.product = item.product.title;
          });
          this.dataSource = new MatTableDataSource(res.details);
        },
      });
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
