import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { Product } from '../utils/intefaces';
const base_url = environment.base_url + '/uploads';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  upload_image(id: string, type: string, data: any): Observable<any> {
    const url = `${base_url}/upload_image/${id}/${type}`;
    const fd = this.createFormData(data);
    return this.http.post(url, fd, this.headers);
  }

  private createFormData(data: any): FormData {
    const fd = new FormData();
    Object.keys(data).forEach((key) => fd.append(key, data[key]));
    return fd;
  }
}
