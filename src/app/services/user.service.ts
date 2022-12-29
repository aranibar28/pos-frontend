import { HttpClient, HttpParams } from '@angular/common/http';
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

  read_users(parameters: any): Observable<Response> {
    const { page, limit, search, status, order } = parameters;

    let params = new HttpParams().set('page', page).set('limit', limit);
    params = search ? params.set('search', search) : params;
    params = status ? params.set('status', status) : params;
    params = order ? params.set('order', order) : params;

    const url = `${base_url}/read_users`;
    return this.http.get<Response>(url, { ...this.headers, params });
  }

  read_all_users(): Observable<any> {
    const url = `${base_url}/read_all_users`;
    return this.http.get(url, this.headers);
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
