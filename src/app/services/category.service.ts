import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  read_categories(parameters: any): Observable<Response> {
    const { page, limit, search, status, order } = parameters;

    let params = new HttpParams().set('page', page).set('limit', limit);
    params = search ? params.set('search', search) : params;
    params = status ? params.set('status', status) : params;
    params = order ? params.set('order', order) : params;

    const url = `${base_url}/read_categories`;
    return this.http.get<Response>(url, { ...this.headers, params });
  }

  read_all_categories(): Observable<Category[]> {
    const url = `${base_url}/read_all_categories/`;
    return this.http.get(url, this.headers).pipe(
      map((res: any) => {
        return res.data.filter((item: Category) => item.status === true);
      })
    );
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
