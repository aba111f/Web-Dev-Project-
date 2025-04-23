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
  defaultDate: string;
  private destroy$ = new Subject<void>();
  newProfit: Profit;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private service: ProfitService) {
    this.newProfit = {
      date: new Date(), 
      profit: 0,
      user_id: 0 
    };

    const today = new Date();
    this.defaultDate = today.toISOString().split('T')[0];
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    const profitToSend: Profit = {
      ...this.newProfit,
      date: new Date(this.newProfit.date)
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
    this.newProfit = {
      date: new Date(),
      profit: 0,
      user_id: 0
    };
  }
}