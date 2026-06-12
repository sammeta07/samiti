import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../../components/header/header.service';
import { NotifierService } from '../../../shared/notifier/notifier.service';

export interface CreateCommitteeRequest {
  name: string;
  since: number;
  area: string;
  contact_numbers: string[]; // Packages primary & secondary into an array
  description: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-create-committee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss'
})
export class CreateCommitteeDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateCommitteeDialogComponent>);
  private readonly http = inject(HttpClient);
  private readonly notifier = inject(NotifierService);
  private readonly headerService = inject(HeaderService);

  // Form Field bindings matching your exact UI image input elements
  public committeeName: string = '';
  public sinceYear: number = 2026; // Default preset as per your screenshot
  public areaLocation: string = '';
  public primaryContact: string = '';
  public secondaryContact: string = '';
  public description: string = '';

  ngOnInit(): void {
    // Automatically capture user range search coordinates from our header services
    const currentCords = this.headerService.userLocationCords();
    if (!currentCords) {
      console.warn('Location coords delayed. Using local fallback configurations.');
    }
  }

  // Mandatory boundary condition validation check to enable/disable button
  get isFormValid(): boolean {
    return (
      !!this.committeeName.trim() &&
      !!this.sinceYear &&
      !!this.areaLocation.trim() &&
      !!this.primaryContact.trim() &&
      !!this.description.trim()
    );
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if (!this.isFormValid) return;

    const coords = this.headerService.userLocationCords();
    
    // Clean dynamic packaging wrapper setup
    const contactsArray: string[] = [this.primaryContact.trim()];
    if (this.secondaryContact.trim()) {
      contactsArray.push(this.secondaryContact.trim());
    }

    const payload: CreateCommitteeRequest = {
      name: this.committeeName.trim(),
      since: this.sinceYear,
      area: this.areaLocation.trim(),
      contact_numbers: contactsArray,
      description: this.description.trim(),
      latitude: coords ? coords.lat : 21.2211103, // Dynamic browser telemetry
      longitude: coords ? coords.long : 81.4502262
    };

    this.http.post<any>('http://localhost:3000/api/committees/create', payload, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response && response.statusCode !== 200) {
            this.notifier.error(response.message || 'Failed to construct committee metadata.');
            return;
          }
          this.notifier.success('Committee created successfully!');
          this.dialogRef.close(true); // Signal home layout component loop to clear/reload list view
        },
        error: (err) => {
          this.notifier.error(err?.error?.message || 'Server infrastructure connection dropped.');
        }
      });
  }
}