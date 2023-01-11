import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Response, Product } from 'src/app/utils/intefaces';
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

  create_product(data: Product): Observable<any> {
    const url = `${base_url}/create_product`;
    return this.http.post(url, data, this.headers);
  }

  read_products(parameters: any): Observable<Response> {
    const { page, limit, search, status, order } = parameters;

    let params = new HttpParams().set('page', page).set('limit', limit);
    params = search ? params.set('search', search) : params;
    params = status ? params.set('status', status) : params;
    params = order ? params.set('order', order) : params;

    const url = `${base_url}/read_products`;
    return this.http.get<Response>(url, { ...this.headers, params });
  }

  read_all_products(): Observable<any> {
    const url = `${base_url}/read_all_products`;
    return this.http
      .get(url, this.headers)
      .pipe(
        map(({ data }: any) =>
          data.sort((a: any, b: any) => a.title.localeCompare(b.title))
        )
      );
  }

  read_all_products_active(): Observable<any> {
    const url = `${base_url}/read_all_products`;
    return this.http.get(url, this.headers).pipe(
      map((res: any) =>
        res.data
          .map((res: any) => res)
          .filter((item: Product) => {
            return item.status == true && item.stock > 0;
          })
          .sort((a: any, b: any) => {
            return a.title.localeCompare(b.title);
          })
      )
    );
  }

  update_product(id: string, data: Product): Observable<any> {
    const url = `${base_url}/update_product/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_product(id: string): Observable<any> {
    const url = `${base_url}/delete_product/${id}`;
    return this.http.delete(url, this.headers);
  }
}
