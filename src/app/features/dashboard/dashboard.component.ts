import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardService } from './dashboard.service';
import { DashboardUser } from './dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  
  user: DashboardUser | null = null;
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = this.dashboardService.isLoggedIn();
    if (this.isLoggedIn) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    // TODO: Fetch user data from API when available
    this.user = {
      id: 0,
      email: 'user@example.com',
      name: 'User',
    };
  }

  onLogout(): void {
    this.dashboardService.logout();
    window.location.reload();
  }
}
