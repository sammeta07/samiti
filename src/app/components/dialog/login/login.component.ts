import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from '../../../core/services/auth.service'; // Sync global states
import { NotifierService } from '../../../shared/notifier/notifier.service';

const REMEMBER_KEY = 'remember_login';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginDialogComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  rememberMe = false;
  isForgotPassword = false;
  resetEmail = '';
  resetEmailSent = false;

  private notifier = inject(NotifierService);
  private router = inject(Router);
  private authService = inject(AuthService); // Injecting core central signal auth manager
  private loginService = inject(LoginService);

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      try {
        const creds = JSON.parse(atob(saved));
        this.email = creds.email || '';
        this.password = creds.password || '';
        this.rememberMe = true;
      } catch (e) {
        localStorage.removeItem(REMEMBER_KEY);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rememberMe) {
      const creds = btoa(JSON.stringify({ email: this.email, password: this.password }));
      localStorage.setItem(REMEMBER_KEY, creds);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    this.loginService.login({
      email: this.email.trim(),
      password: this.password.trim(),
    }).subscribe({
      next: (response: any) => {
        // 🛠️ Improvement 1: Handle Standardized 200 HTTP Wrapper errors (like 401 Unauthorized)
        if (response && response.statusCode !== 200) {
          this.notifier.error(response.message || 'Invalid credentials. Please try again.');
          return;
        }

        // 🛠️ Improvement 2: Commit identities data to localStorage lifecycle keys
        localStorage.setItem('base_role', response.data.base_role);
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('user_id', response.data.user_id.toString());
        localStorage.setItem('is_logged_in', 'true'); // Flag to survive hard window reload

        // 🛠️ Improvement 3: Trigger centralized reactive signal engine state update
        this.authService.updateLoginState(true);

        this.notifier.success('Welcome back! Login successful.');
        this.dialogRef.close(true);
        
        // 🛠️ Improvement 4: Stay on home page to seamlessly render the horizontal dynamic view change
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // Fallback for actual server crash network drop blocks
        this.notifier.error(err?.error?.message || 'Server connection lost. Please try again later.');
      }
    });
  }

  onForgotPassword(): void {
    if (!this.resetEmail) return;
    console.log('Password reset requested for:', this.resetEmail);
    this.resetEmailSent = true;
  }

  isEmail(value: string): boolean {
    return !value || /[a-zA-Z@.]/.test(value);
  }
}