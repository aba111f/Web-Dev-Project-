export interface Profile {
    id: number,
    username: string;
    FirstName: string;
    LastName: string;
    password: string;
    mail: string;
    phone_num: string;
    age: number;
    PhotoFileName: File | null; 
    BussinesName: string;
    logoName: File | null;
}
