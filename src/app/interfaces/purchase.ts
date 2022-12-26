import { Supplier } from './supplier';

export interface Purchase {
  _id: string;
  supplier: Supplier[];
  status: string;
  origin: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}
