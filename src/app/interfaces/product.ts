import { Category } from './category';

export interface Product {
  _id: string;
  title: string;
  description: string;
  slug: string;
  stock: number;
  price: number;
  status: boolean;
  category: Category;
  created_at: Date;
  updated_at: Date;
}
