import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Sale, Response } from '../utils/intefaces';
const base_url = environment.base_url + '/sales';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_sale(data: Sale): Observable<any> {
    data.date.toISOString();
    const url = `${base_url}/create_sale`;
    return this.http.post(url, data, this.headers);
  }

  read_sales(parameters: any): Observable<Response> {
    const { page, limit, start, end } = parameters;

    let params = new HttpParams().set('page', page).set('limit', limit);

    if (start && end) {
      params = params.set('start', start).set('end', end);
    }

    const url = `${base_url}/read_sales`;
    return this.http.get<Response>(url, { ...this.headers, params });
  }

  read_sale_by_id(id: string): Observable<any> {
    const url = `${base_url}/read_sales_by_id/${id}`;
    return this.http.get(url, this.headers);
  }
}
