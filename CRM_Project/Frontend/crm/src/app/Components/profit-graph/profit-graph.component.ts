import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ProfitService } from '../../Services/profit.service';
import { Profit } from '../../interfaces/profit';

@Component({
  selector: 'app-profit-graph',
  imports: [NgChartsModule, CommonModule, FormsModule],
  templateUrl: './profit-graph.component.html',
  styleUrl: './profit-graph.component.css'
})
export class ProfitGraphComponent {
  private profits: Profit[] = []; 

  constructor(private service: ProfitService){
    this.service.getTotalProfit().subscribe(data => {
      this.profits = data;
    });
  }

  selectedRange = 'Months';
  ranges = ['Years',"Quarters", 'Months', 'Weeks', 'Days'];

  chartType: ChartType = 'line';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  chartData: ChartConfiguration['data'] = this.getChartData(this.selectedRange);

  updateChart() {
    this.chartData = this.getChartData(this.selectedRange);
  }

  getChartData(range: string): ChartConfiguration['data'] {
    switch (range) {
      case 'Years':
        return {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          datasets: [
            {
              data: [10000, 15000, 17000, 21000, 25000],
              label: 'Profit ($)',
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.4,
              fill: true,
            }
          ]
        };

      case 'Months':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [2000, 1800, 2200, 2500, 2700, 3000],
              label: 'Profit ($)',
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.4,
              fill: true,
            }
          ]
        };

        case 'Quarters':
          return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
              {
                data: [800, 700, 1000, 1500],
                label: 'Profit ($)',
                borderColor: '#85219C',
                backgroundColor: 'rgba(85, 11, 245, 0.2)',
                tension: 0.4,
                fill: true,
              }
            ]
          };  

      case 'Weeks':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              data: [700, 800, 850, 900],
              label: 'Profit ($)',
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              tension: 0.4,
              fill: true,
            }
          ]
        };

      case 'Days':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              data: [120, 150, 130, 160, 200, 180, 170],
              label: 'Profit ($)',
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              tension: 0.4,
              fill: true,
            }
          ]
        };

      default:
        return { labels: [], datasets: [] };
    }
  }
}
