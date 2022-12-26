import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { User } from '../interfaces/user';
const base_url = environment.base_url + '/users';
const sunat_url = environment.sunat;
const token = environment.token;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public isLoading = new BehaviorSubject<boolean>(false);
  public courier = new ReplaySubject<any>();
  public courierAllow = new ReplaySubject<any>();

  public emitter(res: any): void {
    this.courier.next(res);
  }

  public emitterAllow(res: any): void {
    this.courierAllow.next(res);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  get payload(): any {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(this.token);
    return decodeToken;
  }

  get id(): string {
    return this.payload['sub'];
  }

  get role(): string {
    return this.payload['role'];
  }

  get allows(): any[] {
    return this.payload['allows'];
  }

  login_user(data: User): Observable<any> {
    const url = `${base_url}/login_user`;
    return this.http.post(url, data, this.headers);
  }

  isValidateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/renew_token`, this.headers).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  consulta_ruc(number: string, type: string): Observable<any> {
    const url = `${sunat_url}/${type}/${number}?token=${token}`;
    return this.http.get(url);
  }
}
