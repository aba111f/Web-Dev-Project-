import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeCreate } from '../../interfaces/employee';
import { EmployeeService } from '../../Services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.css']
})
export class EmployeePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(EmployeeService);

  employees: Employee[] = [];
  form!: FormGroup;
  editMode = false;
  editingId: number | null = null;

  ngOnInit() {
    
    this.initForm();
    this.load();
  }

  private initForm() {
    this.form = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      salary: [0, Validators.required],
      specialization: ['', Validators.required],
      is_active: [true]
    });
  }

  load() {
    this.svc.getAll().subscribe(list => {
      console.log(list);
      this.employees = list
    });
    
  }

  private markFormAsTouched() {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    alert('Заполните все обязательные поля!');
  }

  private handleSuccess() {
    this.load();
    this.resetForm();
    alert(this.editMode ? 'Данные обновлены!' : 'Сотрудник добавлен!');
  }

  private handleError(err: HttpErrorResponse) {
    console.error('Полная ошибка:', err);
    
    if (err.status === 400) {
      let errorMessage = 'Ошибки валидации:';
      for (const [field, errors] of Object.entries(err.error)) {
        // errorMessage += `\n• ${field}: ${errors.join(', ')}`;
      }
      alert(errorMessage);
    } else {
      alert(`Ошибка сервера: ${err.statusText}`);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }
  
    const formData = {
      ...this.form.value,
      user_id: localStorage.getItem('user_id') 
    };
  
    const operation = this.editMode 
      ? this.svc.update(this.editingId!, formData)
      : this.svc.create(formData);
  
    operation.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }


  edit(emp: Employee) {
    this.editMode = true;
    this.editingId = emp.id;
    this.form.patchValue({
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      mail: emp.mail,
      salary: emp.salary,
      specialization: emp.specialization,
      is_active: emp.is_active
    });
  }
  
  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.form.reset({ 
      FirstName: '', 
      LastName: '', 
      mail: '', 
      salary: 0, 
      specialization: '', 
      is_active: true 
    });
  }
  
  delete(emp: Employee) {
    if (!confirm(`Удалить ${emp.FirstName} ${emp.LastName}?`)) return;
    this.svc.delete(emp.id).subscribe(() => this.load());
  }
}
