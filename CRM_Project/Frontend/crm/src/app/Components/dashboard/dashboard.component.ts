import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DatePipe]
})
export class DashboardComponent {
  today: string | null;

  constructor(private datePipe: DatePipe) {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

}
