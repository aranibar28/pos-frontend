export interface User {
  _id: string;
  email: string;
  password: string;
  dni: string;
  first_name: string;
  last_name: string;
  full_name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
