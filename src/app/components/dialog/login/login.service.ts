import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginPayload, LoginResponse } from './login.models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}${environment.endpoints.auth.login}`, body);
  }

  saveUserData(data: LoginResponse): void {
    localStorage.setItem('token', JSON.stringify(data.token));
  }

}
