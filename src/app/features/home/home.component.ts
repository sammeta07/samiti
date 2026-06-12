import { Component, inject, effect, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommitteeListApiResponse, CommitteeListRequestBackend, CommitteeListResponse } from './home.models';
import { HomeService } from './home.service';
import { HeaderService } from '../../components/header/header.service';
import { NotifierService } from '../../shared/notifier/notifier.service';
import { AuthService } from '../../core/services/auth.service';
import { CreateCommitteeDialogComponent } from '../../components/dialog/create-committee/create-committee.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private readonly headerService = inject(HeaderService);
  private readonly homeService = inject(HomeService);
  private readonly notifier = inject(NotifierService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService); // Injecting core centralized state signal
  private readonly dialog = inject(MatDialog); // Injecting MatDialog to open dialogs

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  userLocationCords = this.headerService.userLocationCords;
  radiusOptions: number[] = [1, 5, 10, 25, 100, 1000];
  selectedCommitteeRadius: number = 5;
  selectedProgramRadius: number = 5;
  committeeList: any[] = []; // Changed type declaration signature mapping context safe state
  copiedCommitteeId: string | null = null;

  // 🛠️ Reactive Computed Getter: Sync changes natively across header operations
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor() {
    effect(() => {
      const coords = this.userLocationCords();
      if (coords) {
        this.getCommitteeListByRange();
      }
    });
  }

  ngAfterViewInit(): void {}

  onRadiusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCommitteeRadius = Number(target.value);
    this.getCommitteeListByRange();
  }

  getCommitteeListByRange() {
    const locationCoords = this.userLocationCords();
    if (!locationCoords) return;

    const body: CommitteeListRequestBackend = {
      lat: locationCoords.lat,
      long: locationCoords.long,
      rangeKm: this.selectedCommitteeRadius,
    };

    this.homeService.getCommitteeListByRange(body).subscribe({
      next: (res: CommitteeListApiResponse) => {
        console.log('Committee list fetched successfully:', res);
        this.committeeList = res.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notifier.error(error?.error?.message || error?.error || 'Failed to fetch committees');
        this.cdr.detectChanges();
      }
    });
  }

// ➕ Action: Trigger Create Committee Popup Framework Checkpoint
openCreateCommitteeDialog(): void {
  const dialogRef = this.dialog.open(CreateCommitteeDialogComponent, {
    width: '440px', // Standard comfortable width matrix matching form image
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((reloaded: boolean) => {
    // If modal returns true (meaning successful data insertion occurred)
    if (reloaded) {
      console.log('Creation pipeline success detected. Running immediate view refresh sync...');
      this.getCommitteeListByRange(); // Automatically re-hits list API to show newly made card live!
    }
  });
}

  // 🛡️ Action: Send Request to join Selected operational matrix unit
  joinCommittee(committeeId: number, event: Event): void {
    event.stopPropagation(); // Avoid panel toggle conflict during interaction
    console.log(`Pipeline executing join request directly targeting identification key: ${committeeId}`);
    this.notifier.success(`Join request dispatched for Committee ID: ${committeeId}`);
  }

  // ❤️ Action: Dynamic Local state switching controller mapping execution properties
  toggleFavouriteCommittee(committeeId: number, event: Event): void {
    event.stopPropagation(); // Avoid panel toggle conflict during interaction
    const target = this.committeeList.find(g => g.committee_id === committeeId);
    if (target) {
      target.is_favourite = !target.is_favourite;
      this.notifier.success(target.is_favourite ? 'Added to Favourites' : 'Removed from Favourites');
      this.cdr.detectChanges();
    }
  }

  expandAll() {
    if (this.accordion) {
      Promise.resolve().then(() => this.accordion.openAll());
    }
  }

  collapseAll() {
    if (this.accordion) {
      Promise.resolve().then(() => this.accordion.closeAll());
    }
  }

  getTruncatedDescription(description: string | null): string {
    if (!description) return '';
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  getDistanceFromUser(committee: any): string {
    if (committee?.distance == null) return '';
    const distanceMeters = committee.distance;
    if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
    return `${Number((distanceMeters / 1000).toFixed(1))} km`;
  }
  
  async copyCommitteeId(committeeId: string, event: Event, tooltip: MatTooltip): Promise<void> {
    event.stopPropagation();
    try {
      this.copiedCommitteeId = committeeId;
      this.cdr.detectChanges();
      await navigator.clipboard.writeText(committeeId);

      const originalMessage = tooltip.message;
      tooltip.message = `Committee Id copied - ${committeeId}`;
      tooltip.show();

      setTimeout(() => {
        this.copiedCommitteeId = null;
        this.cdr.detectChanges();
      }, 2000);

      setTimeout(() => {
        tooltip.hide();
        setTimeout(() => tooltip.message = originalMessage, 500);
      }, 2000);
    } catch (err) {
      this.notifier.error('Failed to copy Committee Id');
      this.copiedCommitteeId = null;
      this.cdr.detectChanges();
    }
  }
}