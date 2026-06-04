import { Component, ViewChild, ElementRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderService } from './header.service';
import { LocationCoords } from './header.models';
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
          const body: LocationCoords= {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
          this.headerService.getUserLocation(body).subscribe((data) => {
            this.locationName.set(data.address?.state_district || 'Location');
            this.isLoading.set(false);
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.locationName.set('Location denied');
          this.isLoading.set(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.locationName.set('Not supported');
      this.isLoading.set(false);
    }
  }


}
