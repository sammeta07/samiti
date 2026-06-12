import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HeaderService } from '../../../components/header/header.service';
import { NotifierService } from '../../../shared/notifier/notifier.service';
import { CreateCommitteeService } from './create-committee.service';
import { CreateCommitteePayload } from './create-committee.models';

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
  private readonly createCommitteeService = inject(CreateCommitteeService);
  private readonly notifier = inject(NotifierService);
  private readonly headerService = inject(HeaderService);

  // 📝 HTML Template NgModel variables synced perfectly
  public committeeName: string = '';
  public sinceYear: number = 2026;
  public areaLocation: string = '';
  public primaryContact: string = '';
  public secondaryContact: string = '';
  public description: string = '';

  ngOnInit(): void {
    // Coordinate synchronization tracking console
    const currentCords = this.headerService.userLocationCords();
    if (currentCords) {
      console.log('User telemetry synced into creation form context:', currentCords);
    }
  }

  // 🛑 Verification check rule to handle footer button state
  get isFormValid(): boolean {
    return (
      !!this.committeeName?.trim() &&
      !!this.sinceYear &&
      !!this.areaLocation?.trim() &&
      !!this.primaryContact?.trim() &&
      !!this.description?.trim()
    );
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {   
    if (!this.isFormValid) return;

    const coords = this.headerService.userLocationCords();
    
    // Package numbers list wrapper array format
    const contactsArray: string[] = [this.primaryContact.trim()];
    if (this.secondaryContact?.trim()) {
      contactsArray.push(this.secondaryContact.trim());
    }

// 🚀 Exact payload structure matching your verified backend POST rule
    const payload: CreateCommitteePayload = {
      name: this.committeeName.trim(),
      since: this.sinceYear,
      area: this.areaLocation.trim(),
      contact_numbers: contactsArray,
      description: this.description.trim(),
      latitude: coords ? coords.lat : 21.2211103, // Dynamic browser tracking state with safe fallback
      longitude: coords ? coords.long : 81.4502262
    };

    // Use CreateCommitteeService for API call
    this.createCommitteeService.createCommittee(payload)
      .subscribe({
        next: (response) => {
          if (response && response.statusCode !== 200) {
            this.notifier.error(response.message || 'Creation rejected by server module context.');
            return;
          }
          this.notifier.success('Committee constructed successfully!');
          this.dialogRef.close(true); // Close popup window and pass 'true' signal to trigger refresh matrix
        },
        error: (err) => {
          this.notifier.error(err?.error?.message || 'Server connection exception or network timeout.');
        }
      });
  }
}
