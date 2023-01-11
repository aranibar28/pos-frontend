import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Rol, UserRole } from 'src/app/utils/intefaces';
const base_url = environment.base_url + '/roles';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: new HttpHeaders({ token: this.token }) };
  }

  create_role(data: Rol): Observable<any> {
    const url = `${base_url}/create_role`;
    return this.http.post(url, data, this.headers);
  }

  read_roles(): Observable<any> {
    const url = `${base_url}/read_roles`;
    return this.http.get(url, this.headers);
  }

  update_role(id: string, data: Rol): Observable<any> {
    const url = `${base_url}/update_role/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_role(id: string): Observable<any> {
    const url = `${base_url}/delete_role/${id}`;
    return this.http.delete(url, this.headers);
  }

  create_branch(data: UserRole): Observable<any> {
    const url = `${base_url}/create_branch`;
    return this.http.post(url, data, this.headers);
  }

  read_branch(): Observable<any> {
    const url = `${base_url}/read_branch`;
    return this.http.get(url, this.headers);
  }

  update_branch(id: string, data: any): Observable<any> {
    const url = `${base_url}/update_branch/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_branch(id: string): Observable<any> {
    const url = `${base_url}/delete_branch/${id}`;
    return this.http.delete(url, this.headers);
  }
}
