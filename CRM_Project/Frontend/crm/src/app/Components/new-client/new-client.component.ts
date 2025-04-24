import { Component , EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActiveClients } from '../../interfaces/active-clients';
import { ActiveClientsService } from '../../Services/active-clients.service';
import { Subject, takeUntil } from 'rxjs';
import { ActiveClientsComponent } from '../active-clients/active-clients.component';

@Component({
  standalone: true,
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css'],
  imports: [FormsModule, CommonModule]
})
export class NewClientComponent {
  @Output() clientAdded = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  newClient: ActiveClients;
  successMessage = '';
  errorMessage = '';

  constructor(private service: ActiveClientsService) {
    this.newClient = {
      name: '',
      is_active: true,
      user_id: Number(localStorage.getItem('user_id')) || 0
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.service.addClient(this.newClient).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Client added successfully!';
          this.resetForm();
          this.clientAdded.emit();
        },
        error: (err) => {
          this.errorMessage = 'Error adding client: ' + (err.error?.message || err.message);
        }
      });
  }

  resetForm() {
    this.newClient = {
      name: '',
      is_active: true,
      user_id: Number(localStorage.getItem('user_id')) || 0
    };
  }
}
