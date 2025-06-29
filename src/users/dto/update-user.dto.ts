export class UpdateUserDto {
  name?: string;
  email?: string;
  username?:string;
  passwordHash?: string;
  role?: 'admin' | 'editor' | 'reader';
  orcid_id?: string | null;
  location?:string;
  bio?:string;
}
