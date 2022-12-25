import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
const base_url = environment.base_url + '/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_product(data: any): Observable<any> {
    const url = `${base_url}/create_product`;
    return this.http.post(url, data, this.headers);
  }

  read_products(
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<any> {
    const url = `${base_url}/read_products?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get(url, this.headers);
  }

  read_product_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_product_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_product(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_product/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_product(id: any): Observable<any> {
    const url = `${base_url}/delete_product/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/change_status/${id}`;
    return this.http.put(url, data, this.headers);
  }

  create_variety(id: any, data: any): Observable<any> {
    const url = `${base_url}/create_variety/${id}`;
    return this.http.post(url, data, this.headers);
  }

  read_varieties(): Observable<any> {
    const url = `${base_url}/read_varieties`;
    return this.http.get(url, this.headers);
  }

  read_variety_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_variety_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  delete_variety(id: any): Observable<any> {
    const url = `${base_url}/delete_variety/${id}`;
    return this.http.delete(url, this.headers);
  }

  create_inventory(data: any): Observable<any> {
    const url = `${base_url}/create_inventory`;
    return this.http.post(url, data, this.headers);
  }

  delete_inventory(id: any): Observable<any> {
    const url = `${base_url}/delete_inventory/${id}`;
    return this.http.delete(url, this.headers);
  }

  list_inventory(): Observable<any> {
    const url = `${base_url}/list_inventory`;
    return this.http.get(url, this.headers);
  }

  list_inventory_general(): Observable<any> {
    const url = `${base_url}/list_inventory_general`;
    return this.http.get(url, this.headers);
  }

  list_inventory_entry(year: any, month: any): Observable<any> {
    const url = `${base_url}/list_inventory_entry/${year}/${month}`;
    return this.http.get(url, this.headers);
  }

  list_inventory_exit(year: any, month: any): Observable<any> {
    const url = `${base_url}/list_inventory_exit/${year}/${month}`;
    return this.http.get(url, this.headers);
  }
}
