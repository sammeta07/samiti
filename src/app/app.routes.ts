import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // Is guard ka code niche hai

export const routes: Routes = [
  // 1. Home / Landing Configuration
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },

  // 2. Secured Dashboard Loop with Lazy Loading & Bulletproof Auth Guard
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] // Protects route checkpoint completely
  },

  // 3. Fallback Route Wildcard Standard
  { 
    path: '**', 
    redirectTo: '' 
  },
];