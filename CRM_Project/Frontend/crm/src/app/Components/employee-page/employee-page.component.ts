import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeCreate } from '../../interfaces/employee';
import { EmployeeService } from '../../Services/employee.service';

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
    console.log(this.employees);
    this.initForm();
    this.load();
  }

  private initForm() {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name:  ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      salary:    [0, Validators.required],
      specialization: ['', Validators.required],
      is_active: [true]
    });
  }

  load() {
    this.svc.getAll().subscribe(list => this.employees = list);
    
  }

  onSubmit() {
    const data: EmployeeCreate = this.form.value;
    if (this.editMode && this.editingId != null) {
      this.svc.update(this.editingId, data).subscribe(() => {
        this.load();
        this.resetForm();
      });
    } else {
      this.svc.create(data).subscribe(() => {
        this.load();
        this.resetForm();
      });
    }
  }

  edit(emp: Employee) {
    this.editMode = true;
    this.editingId = emp.id;
    this.form.patchValue({
      FirstName: emp.first_name,
      LastName: emp.last_name,
      mail: emp.email,
      salary: emp.salary,
      specialization: emp.specialization,
      is_active: emp.is_active
    });
  }

  delete(emp: Employee) {
    if (!confirm(`Удалить ${emp.first_name} ${emp.last_name}?`)) return;
    this.svc.delete(emp.id).subscribe(() => this.load());
  }

  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.form.reset({ FirstName: '', LastName: '', mail: '', salary: 0, specialization: '', is_active: true });
  }
}
