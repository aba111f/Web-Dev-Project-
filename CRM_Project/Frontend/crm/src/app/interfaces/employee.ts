export interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  salary: number;
  specialization: string;
  is_active: boolean;
}

export type EmployeeCreate = Omit<Employee, 'id' | 'user_id'>;