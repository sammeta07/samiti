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

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private loginService: LoginService
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
      next: (response) => {
        console.log(response);
        localStorage.setItem('base_role', response.data.base_role);
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.data.email);
        this.dialogRef.close(true);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.notifier.error(err?.error?.message || 'Login failed. Please try again.');
      }
    });
  }

  onForgotPassword(): void {
    if (!this.resetEmail) return;
    // TODO: call actual password reset API
    console.log('Password reset requested for:', this.resetEmail);
    this.resetEmailSent = true;
  }

  isEmail(value: string): boolean {
    return !value || /[a-zA-Z@.]/.test(value);
  }
}
