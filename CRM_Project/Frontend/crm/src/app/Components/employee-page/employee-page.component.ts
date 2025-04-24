import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeCreate } from '../../interfaces/employee';
import { EmployeeService } from '../../Services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.css']
})
export class EmployeePageComponent implements OnInit, OnDestroy {
  
  private fb = inject(FormBuilder);
  private svc = inject(EmployeeService);
  private destroy$ = new Subject<void>();
  employees: Employee[] = [];
  form!: FormGroup;
  editMode = false;
  editingId: number | null = null;

  ngOnInit() {
    
    this.initForm();
    this.load();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, this.strictEmailValidator]],
      specialization: ['', [Validators.required, Validators.minLength(2)]],
      salary: [null, [Validators.required, Validators.min(1)]],
      is_active: [true],
    });
  }

  load() {
    this.svc.getAll().pipe(takeUntil(this.destroy$))
    .subscribe(list => {
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

  private handleSuccess(isEdit: boolean) {
    this.load();
    this.resetForm();
    alert(isEdit ? 'Данные обновлены!' : 'Сотрудник добавлен!');
  }

  private handleError(err: HttpErrorResponse) {
    console.error('Полная ошибка:', err);
    
    if (err.status === 400) {
      let errorMessage = 'Ошибки валидации:';
      // for (const [field, errors] of Object.entries(err.error)) {
      //   // errorMessage += `\n• ${field}: ${errors.join(', ')}`;
      // }
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
  
    const isEdit = this.editMode; 
    const operation = isEdit 
      ? this.svc.update(this.editingId!, this.form.value)
      : this.svc.create(this.form.value);
  
    operation.subscribe({
      next: () => this.handleSuccess(isEdit), 
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

  strictEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!email || emailRegex.test(email)) {
      return null;
    }
    return { invalidEmail: true };
  }
  
}
