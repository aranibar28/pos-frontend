import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Response, Category } from 'src/app/utils/intefaces';
const base_url = environment.base_url + '/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_category(data: Category): Observable<any> {
    const url = `${base_url}/create_category`;
    return this.http.post<any>(url, data, this.headers);
  }

  read_categories(
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<Response> {
    const url = `${base_url}/read_categories?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get<Response>(url, this.headers);
  }

  read_all_categories(): Observable<any> {
    const url = `${base_url}/read_all_categories/`;
    return this.http.get(url, this.headers);
  }

  read_category_by_id(id: string): Observable<any> {
    const url = `${base_url}/read_category_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_category(id: string, data: Category): Observable<any> {
    const url = `${base_url}/update_category/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_category(id: string): Observable<any> {
    const url = `${base_url}/delete_category/${id}`;
    return this.http.put(url, {}, this.headers);
  }
}
