export interface Response {
  docs: any[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null;
  nextPage: number;
}

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

export interface Roles {
  _id: string;
  title: string;
  status?: boolean;
  allows: AllowsRoles;
}

export interface AllowsRoles {
  users: boolean;
  suppliers: boolean;
  categories: boolean;
  products: boolean;
  purchases: boolean;
  sales: boolean;
  roles: boolean;
  inventories: boolean;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  audit_create_user: boolean;
  audit_create_date: Date;
  audit_update_user: boolean | null;
  audit_update_date: Date | null;
  audit_delete_user: null;
  audit_delete_date: null;
}

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

export interface Supplier {
  _id: string;
  ruc: string;
  name: string;
  address: string;
  phone: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Purchase {
  _id: string;
  supplier: Supplier;
  status: string;
  origin: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface Sale {
  _id: string;
  user: User;
  status: string;
  origin: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}
