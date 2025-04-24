import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfitService } from '../../Services/profit.service';
import { Profit } from '../../interfaces/profit';
import { ActiveClients } from '../../interfaces/active-clients';
import { ActiveClientsService } from '../../Services/active-clients.service';
import { ProjectsService } from '../../Services/projects.service';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeClientsArr: ActiveClients[] = [];
  profits: Profit[] = []; 
  projects: Project[] = []
  activeClients: number = 0;
  totalProfit: number = 0;
  activeProjects: number = 0;
  
  quarterlyRevenue: number = 0;
  currentQuarter: number;
  currentYear: number;
  today: string | null;

  private destroy$ = new Subject<void>();

  constructor(
    private datePipe: DatePipe, 
    private service: ProfitService,
    private service2: ActiveClientsService,
    private service3: ProjectsService
  ) {
    const now = new Date();
    this.today = this.datePipe.transform(now, 'yyyy-MM-dd');
    this.currentQuarter = Math.floor(now.getMonth() / 3) + 1;
    this.currentYear = now.getFullYear();
  }

  ngOnInit() {
    this.service.getTotalProfit().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.profits = data;
      this.calculateTotalProfit();
      this.calculateQuarterlyRevenue();
    });

    this.service2.getActiveClients().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.activeClientsArr = data;
      this.calculateActiveClients();
    
    }
    )
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); 
  }


  private calculateTotalProfit(): void {
    this.totalProfit = this.profits.reduce((sum, current) => sum + current.profit, 0);
  }

  private calculateActiveClients(): void {
    this.activeClients = this.activeClientsArr.filter(client => client.is_active).length;
  }

  private calculateActiveProjects(): void {
    this.activeProjects = this.projects.filter(client => client.is_active).length;
  }

  private calculateQuarterlyRevenue(): void {
    this.quarterlyRevenue = this.profits
      .filter(profit => {
        const profitDate = new Date(profit.date);
        const profitQuarter = Math.floor(profitDate.getMonth() / 3) + 1;
        return (
          profitDate.getFullYear() === this.currentYear && 
          profitQuarter === this.currentQuarter
        );
      })
      .reduce((sum, current) => sum + current.profit, 0);
  }

  getQuarterDates(): string {
    const quarterStartMonth = (this.currentQuarter - 1) * 3;
    const quarterEndMonth = quarterStartMonth + 2;
    
    const startDate = new Date(this.currentYear, quarterStartMonth, 1);
    const endDate = new Date(this.currentYear, quarterEndMonth + 1, 0); // Last day of end month
    
    return `${this.datePipe.transform(startDate, 'MMM d')} - ${this.datePipe.transform(endDate, 'MMM d, y')}`;
  }
}