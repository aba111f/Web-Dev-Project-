import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ProfitService } from '../../Services/profit.service';
import { Profit } from '../../interfaces/profit';
import { NewProfitComponent } from '../new-profit/new-profit.component';

@Component({
  selector: 'app-profit-graph',
  imports: [NgChartsModule, CommonModule, FormsModule, NewProfitComponent],
  templateUrl: './profit-graph.component.html',
  styleUrl: './profit-graph.component.css'
})
export class ProfitGraphComponent {
  private profits: Profit[] = []; 

  constructor(private service: ProfitService){
    this.service.getTotalProfit().subscribe(data => {
      this.profits = data;
      this.chartData = this.getChartData(this.selectedRange); 
    });
  }

  selectedRange = 'Months';
  ranges = ['Years', 'Quarters', 'Months', 'Weeks', 'Days'];

  chartType: ChartType = 'line';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  updateChart() {
    this.chartData = this.getChartData(this.selectedRange);
  }

  getChartData(range: string): ChartConfiguration['data'] {
    if (this.profits.length === 0) {
      return { labels: [], datasets: [] };
    }

    switch (range) {
      case 'Years':
        return this.getYearlyData();
      case 'Quarters':
        return this.getQuarterlyData();
      case 'Months':
        return this.getMonthlyData();
      case 'Weeks':
        return this.getWeeklyData();
      case 'Days':
        return this.getDailyData();
      default:
        return { labels: [], datasets: [] };
    }
  }

  private getYearlyData(): ChartConfiguration['data'] {
    const yearlyProfits = new Map<number, number>();
    
    this.profits.forEach(profit => {
      const date = typeof profit.date === 'string' ? new Date(profit.date) : profit.date;
      const year = date.getFullYear();
      yearlyProfits.set(year, (yearlyProfits.get(year) || 0) + profit.profit);
    });

    const years = Array.from(yearlyProfits.keys()).sort();
    const data = years.map(year => yearlyProfits.get(year) || 0);

    return {
      labels: years.map(String),
      datasets: [{
        data: data,
        label: 'Profit ($)',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  private getQuarterlyData(): ChartConfiguration['data'] {
    const quarterlyProfits = new Map<string, number>();
    
    this.profits.forEach(profit => {
      const date = typeof profit.date === 'string' ? new Date(profit.date) : profit.date;
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `Q${quarter} ${year}`;
      quarterlyProfits.set(key, (quarterlyProfits.get(key) || 0) + profit.profit);
    });

    const quarters = Array.from(quarterlyProfits.keys()).sort((a, b) => {
      const [qa, ya] = a.split(' ');
      const [qb, yb] = b.split(' ');
      return ya.localeCompare(yb) || qa.localeCompare(qb);
    });
    
    const data = quarters.map(q => quarterlyProfits.get(q) || 0);

    return {
      labels: quarters,
      datasets: [{
        data: data,
        label: 'Profit ($)',
        borderColor: '#85219C',
        backgroundColor: 'rgba(85, 11, 245, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  private getMonthlyData(): ChartConfiguration['data'] {
    const monthlyProfits = new Map<string, number>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.profits.forEach(profit => {
      const date = typeof profit.date === 'string' ? new Date(profit.date) : profit.date;
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${monthNames[month]} ${year}`;
      monthlyProfits.set(key, (monthlyProfits.get(key) || 0) + profit.profit);
    });

    const months = Array.from(monthlyProfits.keys()).sort((a, b) => {
      // Sort by year then by month
      const [ma, ya] = a.split(' ');
      const [mb, yb] = b.split(' ');
      return ya.localeCompare(yb) || monthNames.indexOf(ma) - monthNames.indexOf(mb);
    });

    const data = months.map(m => monthlyProfits.get(m) || 0);

    return {
      labels: months,
      datasets: [{
        data: data,
        label: 'Profit ($)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  private getWeeklyData(): ChartConfiguration['data'] {
    const weeklyProfits = new Map<string, number>();
    
    this.profits.forEach(profit => {
      const date = typeof profit.date === 'string' ? new Date(profit.date) : profit.date;
      const year = date.getFullYear();
      const week = this.getWeekNumber(date);
      const key = `Week ${week}, ${year}`;
      weeklyProfits.set(key, (weeklyProfits.get(key) || 0) + profit.profit);
    });

    const weeks = Array.from(weeklyProfits.keys()).sort((a, b) => {
      const [wa, ya] = a.split(', ');
      const [wb, yb] = b.split(', ');
      return ya.localeCompare(yb) || wa.localeCompare(wb);
    });

    const data = weeks.map(w => weeklyProfits.get(w) || 0);

    return {
      labels: weeks,
      datasets: [{
        data: data,
        label: 'Profit ($)',
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  private getDailyData(): ChartConfiguration['data'] {
    const dailyProfits = new Map<string, number>();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    this.profits.forEach(profit => {
      const date = typeof profit.date === 'string' ? new Date(profit.date) : profit.date;
      const day = dayNames[date.getDay()];
      const dateStr = date.toISOString().split('T')[0]; 
      const key = `${day} ${dateStr}`;
      dailyProfits.set(key, (dailyProfits.get(key) || 0) + profit.profit);
    });

    const days = Array.from(dailyProfits.keys()).sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.split(' ')[1]);
      const dateB = new Date(b.split(' ')[1]);
      return dateA.getTime() - dateB.getTime();
    });

    const data = days.map(d => dailyProfits.get(d) || 0);

    return {
      labels: days,
      datasets: [{
        data: data,
        label: 'Profit ($)',
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) ;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}