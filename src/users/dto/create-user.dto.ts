export class CreateUserDto {
  email: string;
  username?:string;
  passwordHash: string;
  role?: 'admin' | 'editor' | 'reader';
  orc_id?: string | null;
  phoneNumber?:string;
  fullName?:string;
  location?:string;
  bio?:string;
}
