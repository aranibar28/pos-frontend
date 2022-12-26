import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Response, User } from 'src/app/utils/intefaces';
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

  create_user(data: User): Observable<any> {
    const url = `${base_url}/create_user`;
    return this.http.post(url, data, this.headers);
  }

  read_users(
    p: number,
    l: number,
    search: string = '',
    filter: string,
    sort: string
  ): Observable<Response> {
    const url = `${base_url}/read_users?page=${p}&limit=${l}&search=${search}&status=${filter}&sort=${sort}`;
    return this.http.get<Response>(url, this.headers);
  }

  read_user_by_id(id: string): Observable<any> {
    const url = `${base_url}/read_user_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_user(id: string, data: User): Observable<any> {
    const url = `${base_url}/update_user/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_user(id: string): Observable<any> {
    const url = `${base_url}/delete_user/${id}`;
    return this.http.delete(url, this.headers);
  }
}
