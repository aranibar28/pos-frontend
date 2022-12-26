export interface Roles {
  _id: string;
  title: string;
  status?: boolean;
  allows: Allows;
}

export interface Allows {
  users: boolean;
  suppliers: boolean;
  categories: boolean;
  products: boolean;
  purchases: boolean;
  sales: boolean;
  roles: boolean;
  inventories: boolean;
}
