import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SamitiAdminDashboardComponent } from './features/samiti-admin-dashboard/samiti-admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: SamitiAdminDashboardComponent },
];
