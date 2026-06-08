import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  mobile = '';
  password = '';
  hidePassword = true;
  rememberMe = false;
  isForgotPassword = false;
  resetEmail = '';
  resetEmailSent = false;

  private notifier = inject(NotifierService);

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      try {
        const creds = JSON.parse(atob(saved));
        this.mobile = creds.mobile || '';
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
      const creds = btoa(JSON.stringify({ mobile: this.mobile, password: this.password }));
      localStorage.setItem(REMEMBER_KEY, creds);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    this.loginService.login({
      mobile: this.mobile.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (response) => {
        this.loginService.saveUserData(response.data);
        this.notifier.success('Login successful!');
        this.dialogRef.close(true);
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
