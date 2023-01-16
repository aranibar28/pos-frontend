import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

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
  imports: [CommonModule, MatCardModule],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  private kpiService = inject(KpisService);

  public year = moment().format('YYYY');
  public month: string = '';
  public arr_earnings: Array<any> = [];
  public arr_months: Array<any> = [];

  public total_earnings: number = 0;
  public current_earnings: number = 0;
  public users: number = 0;
  public products: number = 0;

  ngOnInit(): void {
    this.init_widgets();
    this.init_graphics();
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

  init_graphics() {
    this.kpiService.kpi_earnings().subscribe({
      next: ({ arr_months, arr_earnings, ...res }) => {
        this.total_earnings = res.total_earnings;
        this.current_earnings = res.current_earnings;
        this.month = arr_months[moment().month()];
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
}
