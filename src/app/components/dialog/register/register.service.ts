import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  message: string;
  data?: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    groupRoles: string[];
    eventRoles: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}auth/register`, payload);
  }
}
