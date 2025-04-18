export interface Profile {
    id: number,
    username: string;
    FirstName: string;
    LastName: string;
    password: string;
    mail: string;
    phone_num: string;
    age: number;
    PhotoFile: File | null; 
    BussinesName: string;
    logoFile: File | null;
}
