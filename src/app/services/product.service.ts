import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Response } from '../interfaces/response';
import { Product } from '../interfaces/product';
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
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<Response> {
    const url = `${base_url}/read_products?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get<Response>(url, this.headers);
  }

  read_products_purchases(): Observable<any> {
    const url = `${base_url}/read_products_options`;
    return this.http
      .get(url, this.headers)
      .pipe(
        map(({ data }: any) =>
          data.sort((a: any, b: any) => a.title.localeCompare(b.title))
        )
      );
  }

  read_products_sales(): Observable<any> {
    const url = `${base_url}/read_products_options`;
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
