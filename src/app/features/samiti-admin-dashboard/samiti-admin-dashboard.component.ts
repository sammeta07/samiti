import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-samiti-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './samiti-admin-dashboard.component.html',
  styleUrl: './samiti-admin-dashboard.component.scss',
})
export class SamitiAdminDashboardComponent {
  constructor(private router: Router) {}
}
