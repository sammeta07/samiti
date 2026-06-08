import { Component, inject, effect, viewChild, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { GroupListApiResponse, GroupListRequestBackend, GroupListResponse } from './home.models';
import { HomeService } from './home.service';
import { HeaderService } from '../../components/header/header.service';
import { NotifierService } from '../../shared/notifier/notifier.service';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private readonly headerService = inject(HeaderService);
  private readonly homeService = inject(HomeService);
  private readonly notifier = inject(NotifierService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  userLocationCords = this.headerService.userLocationCords;
  radiusOptions: number[] = [1, 5, 10, 25, 100, 1000];
  selectedGroupRadius: number = 5;
  selectedProgramRadius: number = 5;
  groupList: GroupListResponse[] = [];
  copiedGroupId: string | null = null;

  constructor() {
    // Watch for changes in user location and fetch groups when available
    effect(() => {
      const coords = this.userLocationCords();
      if (coords) {
        this.getGroupListByRange();
      }
    });
  }

  ngAfterViewInit(): void {
  }

  onRadiusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGroupRadius = Number(target.value);
    this.getGroupListByRange();
  }

  getGroupListByRange() {
    const locationCoords = this.userLocationCords();
    if (!locationCoords) {
      // Don't fetch if location is not available yet
      return;
    }

    // Send flat lat/long format as expected by backend
    const body: GroupListRequestBackend = {
      lat: locationCoords.lat,
      long: locationCoords.long,
      rangeKm: this.selectedGroupRadius,
    };

    this.homeService.getGroupListByRange(body).subscribe({
      next: (res: GroupListApiResponse) => {
        console.log('Group list fetched successfully:', res);
        this.groupList = res.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notifier.error(error?.error?.message || error?.error || 'Failed to fetch groups');
        this.cdr.detectChanges();
      }
    });
  }

  expandAll() {
    if (this.accordion) {
      // Use Promise-based approach to ensure panels are ready
      Promise.resolve().then(() => {
        this.accordion.openAll();
      });
    } else {
      console.warn('Accordion not available for expandAll');
    }
  }

  collapseAll() {
    if (this.accordion) {
      // Use Promise-based approach to ensure panels are ready
      Promise.resolve().then(() => {
        this.accordion.closeAll();
      });
    } else {
      console.warn('Accordion not available for collapseAll');
    }
  }

  openGoogleMaps(group: GroupListResponse) {
    if (group.location_cords) {
      const { lat, long } = group.location_cords;
      const url = `https://www.google.com/maps?q=${lat},${long}`;
      window.open(url, '_blank');
    }
  }

  getTruncatedDescription(description: string | null): string {
    if (!description) return '';
    if (description.length > 100) {
      return description.substring(0, 100) + '...';
    }
    return description;
  }

  getDistanceFromUser(group: GroupListResponse): string {
    // Safe check for null, undefined, or missing distance
    if (group?.distance == null) {
      return '';
    }
    const distanceMeters = group.distance;
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)} m`;
    }
    const distanceKm = distanceMeters / 1000;
    // Trims trailing zeros, so 1.0 km becomes 1 km, but 1.5 km stays 1.5 km
    return `${Number(distanceKm.toFixed(1))} km`;
  }
  
  async copyGroupId(groupId: string, event: Event, tooltip: MatTooltip): Promise<void> {
    event.stopPropagation();
    try {
      // Set copied state to show green check icon
      this.copiedGroupId = groupId;
      this.cdr.detectChanges();

      // Copy to clipboard
      await navigator.clipboard.writeText(groupId);

      // Update tooltip message
      const originalMessage = tooltip.message;
      tooltip.message = `Group Id copied - ${groupId}`;
      tooltip.show();

      // After 5 seconds, revert to copy icon
      setTimeout(() => {
        this.copiedGroupId = null;
        this.cdr.detectChanges();
      }, 2000);

      // Hide tooltip after 2 seconds
      setTimeout(() => {
        tooltip.hide();
        setTimeout(() => {
          tooltip.message = originalMessage;
        }, 500);
      }, 2000);
    } catch (err) {
      this.notifier.error('Failed to copy Group Id');
      this.copiedGroupId = null;
      this.cdr.detectChanges();
    }
  }
}
