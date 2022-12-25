import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
const base_url = environment.base_url + '/purchases';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_purchase(data: any): Observable<any> {
    const url = `${base_url}/create_purchase`;
    return this.http.post(url, data, this.headers);
  }

  read_purchases(): Observable<any> {
    const url = `${base_url}/read_purchases`;
    return this.http.get(url, this.headers);
  }

  read_purchase_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_purchase_by_id/${id}`;
    return this.http.get(url, this.headers);
  }
}
