import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Response, Supplier } from 'src/app/utils/intefaces';
const base_url = environment.base_url + '/suppliers';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_supplier(data: Supplier): Observable<any> {
    const url = `${base_url}/create_supplier`;
    return this.http.post(url, data, this.headers);
  }

  read_suppliers(
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<Response> {
    const url = `${base_url}/read_suppliers?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get<Response>(url, this.headers);
  }

  read_supplier_by_id(id: string): Observable<any> {
    const url = `${base_url}/read_supplier_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_supplier(id: string, data: Supplier): Observable<any> {
    const url = `${base_url}/update_supplier/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_supplier(id: string): Observable<any> {
    const url = `${base_url}/delete_supplier/${id}`;
    return this.http.delete(url, this.headers);
  }
}
