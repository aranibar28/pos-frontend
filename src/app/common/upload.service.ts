import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/utils/enviroments';
import { shareReplay } from 'rxjs/operators';
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

  upload_image(id: string, type: string, file: File): Observable<any> {
    const url = `${base_url}/upload_image/${id}/${type}`;
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post(url, fd, this.headers).pipe(shareReplay(1));
  }
}
