import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ActiveClients } from '../../interfaces/active-clients';
import { ActiveClientsService } from '../../Services/active-clients.service';
import { CommonModule } from '@angular/common';
import { NewClientComponent } from '../new-client/new-client.component';

import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-active-clients',
  standalone: true,
  imports: [NgChartsModule, CommonModule, NewClientComponent],
  templateUrl: './active-clients.component.html',
  styleUrl: './active-clients.component.css'
})
export class ActiveClientsComponent implements OnInit, OnDestroy{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  clients: ActiveClients[] = [];
  activeClients = 0;
  inactiveClients = 0;
  private destroy$ = new Subject<void>();


  constructor(private activeClientsService: ActiveClientsService) {}  

  ngOnInit(): void {
    this.activeClientsService.getActiveClients().pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.clients = data;
      this.activeClients = this.clients.filter(c => c.is_active).length;
      this.inactiveClients = this.clients.length - this.activeClients;

      this.pieChartData.datasets[0].data = [this.activeClients, this.inactiveClients];

      this.chart?.update();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleStatus(client: ActiveClients): void {
    const newStatus = !client.is_active;
    this.activeClientsService.updateClientStatus(client.id!, newStatus).pipe(takeUntil(this.destroy$)).subscribe(() => {
      client.is_active = newStatus;
    });
    this.ngOnInit()
  }

  deleteClient(client: ActiveClients): void {
    if (!client.id) return;
  
    this.activeClientsService.deleteClient(client.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.clients = this.clients.filter(c => c.id !== client.id);

      this.activeClients = this.clients.filter(c => c.is_active).length;
      this.inactiveClients = this.clients.length - this.activeClients;
  
      this.pieChartData.datasets[0].data = [this.activeClients, this.inactiveClients];
      this.chart?.update();
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