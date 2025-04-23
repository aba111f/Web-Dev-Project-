import { Component } from '@angular/core';
import { Profit } from '../../interfaces/profit';
import { ProfitService } from '../../Services/profit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-new-profit',
  templateUrl: './new-profit.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./new-profit.component.css'] 
})
export class NewProfitComponent {
  today: number = Date.now();
  
  newProfit: Profit;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private service: ProfitService) {
    this.newProfit = {
      date: new Date(), 
      profit: 0,
      user_id: 0 
    };
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    const profitToSend: Profit = {
      ...this.newProfit,
      date: new Date(this.newProfit.date)
    };

    this.service.addProfit(profitToSend).subscribe({
      next: () => {
        this.successMessage = 'Profit added successfully!';
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = 'Error adding profit: ' + (err.error?.message || err.message);
      }
    });
  }

  resetForm() {
    this.newProfit = {
      date: new Date(),
      profit: 0,
      user_id: 0
    };
  }
}