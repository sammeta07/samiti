import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterPayload, RegisterResponse } from './register.models';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(body: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}${environment.endpoints.auth.register}`, body);
  }
}
