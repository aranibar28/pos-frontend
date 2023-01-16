import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { RouterModule } from '@angular/router';

const background = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

const border = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  private kpiService = inject(KpisService);

  public year: number = Number(moment().format('YYYY'));
  public month: string = '';
  public last_month: string = '';
  public arr_earnings: Array<any> = [];
  public arr_months: Array<any> = [];

  public total_current_month: number = 0;
  public total_last_month: number = 0;
  public total_current_year: number = 0;
  public total_last_year: number = 0;
  public users: number = 0;
  public products: number = 0;

  ngOnInit(): void {
    this.init_widgets();
    this.init_graphics_1();
    this.init_graphics_2();
    this.init_graphics_3();
  }

  init_widgets() {
    this.kpiService.kpi_widgets().subscribe({
      next: (res) => {
        this.users = res.users;
        this.products = res.products;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  init_graphics_1() {
    this.kpiService.kpi_earnings().subscribe({
      next: ({ arr_months, arr_earnings, ...res }) => {
        this.total_current_year = res.total_current_year;
        this.total_last_year = res.total_last_year;
        this.total_current_month = res.total_current_month;
        this.total_last_month = res.total_last_month;
        this.month = arr_months[arr_months.length - 1];
        this.last_month = arr_months[arr_months.length - 2];
        const ctx = <HTMLCanvasElement>document.getElementById('myChart');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: arr_months,
            datasets: [
              {
                label: 'Ventas',
                data: arr_earnings,
                backgroundColor: background,
                borderColor: border,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                align: 'top',
                formatter: (value, context) => {
                  return 'S/.' + value;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  init_graphics_2() {
    this.kpiService.kpi_top_products().subscribe({
      next: ({ arr_products, arr_counts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('topProducts');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: arr_products,
            datasets: [
              {
                label: 'Productos',
                data: arr_counts,
                backgroundColor: background,
                borderColor: border,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                align: 'center',
                formatter: (value, context) => {
                  return value + ' unid.';
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_3() {
    this.kpiService.kpi_type_sales().subscribe({
      next: ({ arr_counts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('typeSales');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Factura Electrónica', 'Boléta de Venta'],
            datasets: [
              {
                label: 'Comprobantes',
                data: arr_counts,
                backgroundColor: background,
                borderColor: border,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { stacked: true },
            },
            plugins: {
              datalabels: {
                align: 'center',
                formatter: (value, context) => {
                  const datapoints = context.chart.data.datasets[0].data;
                  function totalSum(total: number, datapoint: any) {
                    return total + datapoint;
                  }
                  const totalValue = datapoints.reduce(totalSum, 0);
                  const percentValue = ((value / totalValue) * 100).toFixed(1);
                  return percentValue + '%';
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }
}
