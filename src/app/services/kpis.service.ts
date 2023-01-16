import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
const base_url = environment.base_url + '/kpis';

@Injectable({
  providedIn: 'root',
})
export class KpisService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  kpi_widgets(): Observable<any> {
    const url = `${base_url}/kpi_widgets`;
    return this.http.get(url, this.headers);
  }

  kpi_earnings(): Observable<any> {
    const url = `${base_url}/kpi_earnings`;
    return this.http.get(url, this.headers);
  }

  kpi_top_products(): Observable<any> {
    const url = `${base_url}/kpi_top_products`;
    return this.http.get(url, this.headers);
  }

  kpi_type_sales(): Observable<any> {
    const url = `${base_url}/kpi_type_sales`;
    return this.http.get(url, this.headers);
  }
}
