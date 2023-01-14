import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { Details } from 'src/app/utils/intefaces';
import { SaleService } from 'src/app/services/sale.service';
import { DefaultImageDirective } from 'src/app/directives/default-image.directive';
const columns = ['image', 'product', 'quantity', 'price', 'subtotal'];

@Component({
  selector: 'app-details-sale',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    DefaultImageDirective,
  ],
  templateUrl: './details-sale.component.html',
})
export class DetailsSaleComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DetailsSaleComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);
  private saleService = inject(SaleService);

  public displayedColumns: string[] = columns;
  public dataSource!: MatTableDataSource<Details[]>;
  public data: any = {};

  ngOnInit(): void {
    this.data = this.dialogData;
    setTimeout(() => {
      this.saleService.read_sale_by_id(this.data._id).subscribe({
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
