import { Component } from '@angular/core';
import { ProfitService } from '../../Services/profit.service';
import { Profit } from '../../interfaces/profit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-list.component.html',
  styleUrls: ['./profit-list.component.css']
})
export class ProfitListComponent {
  profits: Profit[] = [];
  editedProfit: Profit | null = null;
  editData = {
    date: '',
    profit: 0
  };

  constructor(private service: ProfitService) {}

  ngOnInit() {
    this.loadProfits();
  }

  loadProfits() {
    this.service.getTotalProfit().subscribe(data => this.profits = data);
  }

  startEdit(profit: Profit) {
    this.editedProfit = profit;
    this.editData = {
      date: new Date(profit.date).toISOString().split('T')[0],
      profit: profit.profit
    };
  }

  cancelEdit() {
    this.editedProfit = null;
  }

  saveEdit() {
    if (this.editedProfit) {
      const updatedProfit = {
        ...this.editedProfit,
        date: new Date(this.editData.date),
        profit: this.editData.profit
      };
  
      this.service.updateProfit(updatedProfit).subscribe({
        next: () => {
          Object.assign(this.editedProfit!, updatedProfit); 
          this.editedProfit = null; 
          this.loadProfits();
        },
        error: (err) => {
          console.error('Error updating profit:', err);
        }
      });
    }
  }

  deleteProfit(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this profit record?')) {
      this.service.deleteProfit(id).subscribe({
        next: () => {
          this.profits = this.profits.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error deleting profit:', err);
        }
      });
    }
  }
}