import { Component, OnInit } from '@angular/core';
import { ProfitService } from '../../Services/profit.service';
import { Profit } from '../../interfaces/profit';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profit-list',
  imports: [CommonModule],
  templateUrl: './profit-list.component.html',
  styleUrl: './profit-list.component.css'
})
export class ProfitListComponent {
  profits: Profit[] = [];

  constructor(private service: ProfitService){

  }

  ngOnInit(){
    this.service.getTotalProfit().subscribe(data => this.profits = data)
  }

  deleteProfit(id: number|undefined) {
    if (confirm('Are you sure you want to delete this profit record?')) {
      this.service.deleteProfit(id).subscribe({
        next: () => {
          this.profits = this.profits.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error deleting profit:', err);
          // Handle error (show message to user)
        }
      });
    }
  }
}
