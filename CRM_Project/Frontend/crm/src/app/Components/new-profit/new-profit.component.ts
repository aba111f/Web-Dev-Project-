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
  newProfit: Profit;
  successMessage: string = '';
  errorMessage: string = '';
  dateString: string; 

  constructor(private service: ProfitService) {
    const today = new Date();
    this.dateString = this.formatDateForInput(today);
    this.newProfit = {
      date: today,
      profit: 0,
      user_id: 0 
    };
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.newProfit.date = new Date(this.dateString);

    this.service.addProfit(this.newProfit).subscribe({
      next: () => {
        this.successMessage = 'Profit added successfully!';
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = 'Error adding profit: ' + (err.error?.message || err.message);
      }
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  resetForm() {
    const today = new Date();
    this.dateString = this.formatDateForInput(today);
    this.newProfit = {
      date: today,
      profit: 0,
      user_id: 0
    };
  }
}