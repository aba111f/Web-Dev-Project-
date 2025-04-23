import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ActiveClients } from '../../interfaces/active-clients';
import { ActiveClientsService } from '../../Services/active-clients.service';
import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';



@Component({
  selector: 'app-active-clients',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './active-clients.component.html',
  styleUrl: './active-clients.component.css'
})
export class ActiveClientsComponent implements OnInit{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  clients: ActiveClients[] = [];
  activeClients = 0;
  inactiveClients = 0;

  constructor(private activeClientsService: ActiveClientsService) {}  

  ngOnInit(): void {
    this.activeClientsService.getActiveClients().subscribe(data => {
      this.clients = data;
      this.activeClients = this.clients.filter(c => c.is_active).length;
      this.inactiveClients = this.clients.length - this.activeClients;

      this.pieChartData.datasets[0].data = [this.activeClients, this.inactiveClients];

      this.chart?.update();
    });
  }

  toggleStatus(client: ActiveClients): void {
    const newStatus = !client.is_active;
    this.activeClientsService.updateClientStatus(client.id!, newStatus).subscribe(() => {
      client.is_active = newStatus;
    });
  }

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  pieChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [this.activeClients, this.inactiveClients], 
      backgroundColor: ['#A5D6A7', '#EF9A9A'],
    }],
  };

  pieChartType: 'pie' = 'pie';

  
}