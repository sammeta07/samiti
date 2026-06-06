import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RegisterService } from './register.service';
import { NotifierService } from '../../../shared/notifier/notifier.service';
import { RegisterPayload } from './register.models';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterDialogComponent {
  name = '';
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;

  private notifier = inject(NotifierService);
  private registerService = inject(RegisterService);

  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const payload: RegisterPayload = {
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      password: this.password,
    };
    this.registerService.register(payload).subscribe({
      next: (result) => {
        this.notifier.success('Registration successful!');
        this.dialogRef.close(true); 
      },
      error: (err) => {
        this.notifier.error(err?.error.error || 'Registration failed. Please try again.');
      }
    });
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get isFormValid(): boolean {
    return !!this.name && !!this.email && !!this.mobile && !!this.password && !!this.confirmPassword && this.passwordsMatch;
  }
}
