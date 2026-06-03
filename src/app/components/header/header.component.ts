import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocationService } from '../../shared/location.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private locationService = inject(LocationService);

  @ViewChild('pillInput') pillInput!: ElementRef<HTMLInputElement>;

  userLocationName  = this.locationService.userLocationName$;
  userLocationCords = this.locationService.userLocationCords$;

  searchQuery      = signal('');
  selectedDistance = signal(5);
  isSearchFocused  = false;

  readonly distanceOptions = [1, 2, 3, 5, 10, 20, 50];

  retryLocation(): void {
    this.locationService.detectLocation();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.pillInput?.nativeElement.focus();
  }

  onDistanceChange(km: number): void {
    this.selectedDistance.set(km);
  }
}
