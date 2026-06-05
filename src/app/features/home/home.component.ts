import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly headerService = inject(HeaderService);
  private readonly homeService = inject(HomeService);
  private readonly notifier = inject(NotifierService);

  userLocationCords = this.headerService.userLocationCords;
  radiusOptions: number[] = [1, 5, 10, 25, 100, 1000];
  selectedRadius: number = 5;
  groupList: GroupListResponse[] = [];

  constructor() {
    // Watch for changes in user location and fetch groups when available
    effect(() => {
      const coords = this.userLocationCords();
      if (coords) {
        this.getGroupListByRange();
      }
    });
  }

  onRadiusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedRadius = Number(target.value);
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
      rangeKm: this.selectedRadius,
    };

    this.homeService.getGroupListByRange(body).subscribe({
      next: (data: GroupListApiResponse) => {
        this.groupList = data.groups;
      },
      error: (error) => {
        this.notifier.error(error?.error?.message || error?.error || 'Failed to fetch groups');
      }
    });
  }
}
