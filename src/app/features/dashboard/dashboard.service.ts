import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardUser, DashboardStats } from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<DashboardUser> {
    return this.http.get<DashboardUser>(`${this.baseUrl}/user/profile`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  getToken(): string | null {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        return parsed;
      } catch {
        return tokenData;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
