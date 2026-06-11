import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RegisterService } from './register.service';
import { NotifierService } from '../../../shared/notifier/notifier.service';
import { RegisterPayload, RegisterResponse } from './register.models';

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
    MatRadioModule,
    MatDatepickerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterDialogComponent {
  name = '';
  email = '';
  mobile = '';
  gender = 'male';
  dateOfBirth: Date | null = null;
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
    const body: RegisterPayload = {
      name: this.name.trim(),
      email: this.email.trim(),
      mobile: this.mobile.trim(),
      gender: this.gender,
      dateOfBirth: this.dateOfBirth ? this.dateOfBirth.toISOString().split('T')[0] : '',
      password: this.password.trim(),
    };
    console.log('Submitting registration with payload:', body);
    this.registerService.register(body).subscribe({
      next: (result : RegisterResponse) => {
        console.log(result);
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
    return !!this.name && !!this.email && !!this.mobile && !!this.gender && !!this.dateOfBirth && !!this.password && !!this.confirmPassword && this.passwordsMatch;
  }
}
