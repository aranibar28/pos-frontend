import { User } from './user';

export interface Sale {
  _id: string;
  user: User[];
  status: string;
  origin: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}
