import { Component , EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project';
import { ProjectsService } from '../../Services/projects.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
  imports: [FormsModule, CommonModule]
})
export class NewProjectComponent {
  @Output() projectAdded = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  newProject: Project;
  successMessage = '';
  errorMessage = '';

  constructor(private service: ProjectsService) {
    this.newProject = {
      title: '',
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

    this.service.addProject(this.newProject).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Client added successfully!';
          this.resetForm();
          this.projectAdded.emit();
        },
        error: (err) => {
          this.errorMessage = 'Error adding client: ' + (err.error?.message || err.message);
        }
      });
  }

  resetForm() {
    this.newProject = {
      title: '',
      is_active: true,
      user_id: Number(localStorage.getItem('user_id')) || 0
    };
  }
}
