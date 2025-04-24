import { Component } from '@angular/core';
import { Profit } from '../../interfaces/profit';
import { ProfitService } from '../../Services/profit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-new-profit',
  templateUrl: './new-profit.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./new-profit.component.css']
})
export class NewProfitComponent {
  private destroy$ = new Subject<void>();
  newProfit: Profit;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private service: ProfitService) {
    // Initialize newProfit with today's date as the default
    const today = new Date();
    this.newProfit = {
      date: today, // Default date is today
      profit: 0,
      user_id: 0
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    // Ensure the date is sent as a Date object
    const profitToSend: Profit = {
      ...this.newProfit,
      date: new Date(this.newProfit.date) // Convert to Date object if necessary
    };

    this.service.addProfit(profitToSend).pipe(takeUntil(this.destroy$))
      .subscribe({
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
    const today = new Date();
    this.newProfit = {
      date: today, // Reset to today's date
      profit: 0,
      user_id: 0
    };
  }
}