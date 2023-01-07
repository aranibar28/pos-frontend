import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
const base_url = environment.base_url + '/business';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_business(data: any): Observable<any> {
    const url = `${base_url}/create_business`;
    return this.http.post(url, data, this.headers);
  }

  read_business(): Observable<any> {
    const url = `${base_url}/read_business`;
    return this.http.get(url, this.headers);
  }

  read_business_config(): Observable<any> {
    const url = `${base_url}/read_business_config`;
    return this.http.get(url, this.headers);
  }

  update_business(id: string, data: any): Observable<any> {
    const url = `${base_url}/update_business/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_business(id: string): Observable<any> {
    const url = `${base_url}/delete_business/${id}`;
    return this.http.delete(url, this.headers);
  }
}
