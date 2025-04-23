export interface Employee {
  id: number;
  FirstName: string;
  LastName: string;
  mail: string;
  salary: number;
  specialization: string;
  is_active: boolean;
}

export interface EmployeeCreate {
  FirstName: string;
  LastName: string;
  mail: string;
  salary: number;
  specialization: string;
  is_active: boolean;
}