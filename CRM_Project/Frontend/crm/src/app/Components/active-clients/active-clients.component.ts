import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-active-clients',
  imports: [NgChartsModule],
  templateUrl: './active-clients.component.html',
  styleUrl: './active-clients.component.css'
})
export class ActiveClientsComponent {
  activeClients = 18;
  inactiveClients = 7;

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  pieChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [this.activeClients, this.inactiveClients],
        backgroundColor: ['#A5D6A7', '#EF9A9A'],
      },
    ],
  };

  pieChartType: 'pie' = 'pie';
}
