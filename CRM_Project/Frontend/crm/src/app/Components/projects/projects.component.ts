import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from '../new-project/new-project.component';

import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProjectsService } from '../../Services/projects.service';
import { Project } from '../../interfaces/project';



@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgChartsModule, CommonModule, NewProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  projects: Project[] = [];
  activeProjects = 0;
  inactiveProjects = 0;
  private destroy$ = new Subject<void>();


  constructor(private service: ProjectsService) {}  

  ngOnInit(): void {
    this.service.getAllProjects().pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.projects = data;
      this.activeProjects = this.projects.filter(c => c.is_active).length;
      this.inactiveProjects = this.projects.length - this.activeProjects;

      this.pieChartData.datasets[0].data = [this.activeProjects, this.inactiveProjects];

      this.chart?.update();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleStatus(client: Project): void {
    const newStatus = !client.is_active;
    this.service.updateProjectStatus(client.id!, newStatus).pipe(takeUntil(this.destroy$)).subscribe(() => {
      client.is_active = newStatus;
    });
    this.ngOnInit()
  }

  deleteProject(client: Project): void {
    if (!client.id) return;
  
    this.service.deleteProject(client.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.projects = this.projects.filter(c => c.id !== client.id);

      this.activeProjects = this.projects.filter(c => c.is_active).length;
      this.inactiveProjects = this.projects.length - this.activeProjects;
  
      this.pieChartData.datasets[0].data = [this.activeProjects, this.activeProjects];
      this.chart?.update();
    });
  }

  onProjectAdded(): void {
    this.service.getAllProjects().pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.projects = data;
        this.activeProjects = this.projects.filter(c => c.is_active).length;
        this.inactiveProjects = this.projects.length - this.activeProjects;

        this.pieChartData.datasets[0].data = [this.activeProjects, this.inactiveProjects];
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
      data: [this.activeProjects, this.inactiveProjects], 
      backgroundColor: ['#A5D6A7', '#EF9A9A'],
    }],
  };

  pieChartType: 'pie' = 'pie';

  
}