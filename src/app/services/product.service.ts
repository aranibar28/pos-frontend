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

  read_products(
    page: number,
    limit: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<Response> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search)
      .set('status', filter)
      .set('sort', sort);
    const url = `${base_url}/read_products`;
    return this.http.get<Response>(url, { ...this.headers, params });
  }

  read_products_purchases(): Observable<any> {
    const url = `${base_url}/read_all_products`;
    return this.http
      .get(url, this.headers)
      .pipe(
        map(({ data }: any) =>
          data.sort((a: any, b: any) => a.title.localeCompare(b.title))
        )
      );
  }

  read_products_sales(): Observable<any> {
    const url = `${base_url}/read_all_products`;
    return this.http.get(url, this.headers).pipe(
      map((res: any) =>
        res.data
          .map((res: any) => res)
          .filter((item: Product) => {
            return item.status == true && item.price > 0;
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
