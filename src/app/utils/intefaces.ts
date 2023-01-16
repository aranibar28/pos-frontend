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

export interface Rol {
  _id: string;
  title: string;
  status?: boolean;
  allows: AllowsRoles;
}

export interface AllowsRoles {
  system: boolean;
  users: boolean;
  suppliers: boolean;
  categories: boolean;
  products: boolean;
  inventories: boolean;
  sales: boolean;
}

export interface Business {
  _id: string;
  ruc: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  status: boolean;
  image: any;
}

export interface Config {
  _id: string;
  business: string;
  currency: string;
  tax: number;
  invoice: any;
  ticket: any;
  image: any;
}

export interface UserRole {
  _id: string;
  user: User;
  role: Rol;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  slug: string;
  stock: number;
  price: number;
  status: boolean;
  image: Image | any;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

export interface Details {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Image {
  public_id: string;
  secure_url: string;
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
export interface Inventory {
  _id: string;
  quantity: number;
  product: Product;
  supplier: Supplier;
  created_at: Date;
  updated_at: Date;
}

export interface Purchase {
  _id: string;
  supplier: Supplier;
  status: string;
  origin: string;
  amount: number;
  details: PurchaseDetail;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseDetail {
  _id: string;
  purcharse: Purchase;
  product: Product;
  quantity: number;
  price: number;
}

export interface Sale {
  _id: string;
  document: string;
  customer: string;
  address: string;
  amount: number;
  tax: number;
  type: string;
  serie: string;
  number: string;
  date: Date;
}

export interface SaleDetail {
  _id: string;
  sale: Sale;
  product: Product;
  quantity: number;
  price: number;
}

export interface Dni {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  codVerifica: string;
}

export interface Ruc {
  ruc: string;
  razonSocial: string;
  nombreComercial: null;
  telefonos: any[];
  tipo: null;
  estado: string;
  condicion: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  fechaInscripcion: null;
  sistEmsion: null;
  sistContabilidad: null;
  actExterior: null;
  actEconomicas: any[];
  cpPago: any[];
  sistElectronica: any[];
  fechaEmisorFe: null;
  cpeElectronico: any[];
  fechaPle: null;
  padrones: any[];
  fechaBaja: null;
  profesion: null;
  ubigeo: string;
  capital: string;
}
