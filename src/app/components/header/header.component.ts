import { Component, OnInit, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderService } from './header.service';
import { LocationCoords } from './header.models';
import { NotifierService } from '../../shared/notifier/notifier.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  locationName = signal<string>('Locating...');
  isLoading = signal<boolean>(true);
  isSearchFocused = signal<boolean>(false);
  hasSearchText = signal<boolean>(false);

  @ViewChild('pillInput') pillInput!: ElementRef<HTMLInputElement>;

  private readonly notifier = inject(NotifierService);

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.detectLocation();
  }

  detectLocation() {
    this.isLoading.set(true);
    this.locationName.set('Locating...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location:', position.coords);
          const body: LocationCoords = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
          // Set the user location coordinates in the service
          this.headerService.userLocationCords.set(body);
          this.headerService.getUserLocation(body).subscribe({
            next: (data) => {
              const place = data.address?.state_district || 'Location';
              this.locationName.set(place);
              this.isLoading.set(false);
            },
            error: () => {
              this.locationName.set('Location unavailable');
              this.isLoading.set(false);
              this.notifier.error('Could not fetch location details.');
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.locationName.set('Location denied');
          this.isLoading.set(false);
          this.notifier.warn('Location permission denied.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.locationName.set('Not supported');
      this.isLoading.set(false);
      this.notifier.info('Geolocation is not supported by this browser.');
    }
  }

  onSearchFocus() {
    this.isSearchFocused.set(true);
  }

  onSearchBlur() {
    this.isSearchFocused.set(false);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.hasSearchText.set(value.length > 0);
  }

  clearSearch() {
    if (this.pillInput?.nativeElement) {
      this.pillInput.nativeElement.value = '';
      this.hasSearchText.set(false);
      this.pillInput.nativeElement.focus();
    }
  }

}
