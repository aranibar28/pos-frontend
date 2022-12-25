import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
const base_url = environment.base_url + '/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_user(data: any): Observable<any> {
    const url = `${base_url}/create_user`;
    return this.http.post(url, data, this.headers);
  }

  read_users(
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<any> {
    const url = `${base_url}/read_users?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get(url, this.headers);
  }

  read_user_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_user_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_user(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_user/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_user(id: any): Observable<any> {
    const url = `${base_url}/delete_user/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/change_status/${id}`;
    return this.http.put(url, data, this.headers);
  }
}
