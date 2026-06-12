import { Component, OnInit, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderService } from './header.service';
import { LocationCoords } from './header.models';
import { NotifierService } from '../../shared/notifier/notifier.service';
import { RegisterDialogComponent } from '../dialog/register/register.component';
import { LoginDialogComponent } from '../dialog/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  locationName = signal<string>('Locating...');
  isLoading = signal<boolean>(true);
  isSearchFocused = signal<boolean>(false);
  hasSearchText = signal<boolean>(false);
  isLoggedIn = signal<boolean>(localStorage.getItem('is_logged_in') === 'true');

  @ViewChild('pillInput') pillInput!: ElementRef<HTMLInputElement>;

  private readonly notifier = inject(NotifierService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

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
          const body: LocationCoords = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
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

  openRegisterDialog(): void {
    document.body.classList.add('dialog-open');
    this.dialog.open(RegisterDialogComponent, {
      position: {
        right: '0',
        top: '0'
      },
      height: '100%',
      width: '50%',
      // maxWidth: '500px',
      // minWidth: '320px',
      autoFocus: true,
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'slide-in-dialog'
    }).afterClosed().subscribe(() => {
      document.body.classList.remove('dialog-open');
    });
  }

  openLoginDialog(): void {
    document.body.classList.add('dialog-open');
    this.dialog.open(LoginDialogComponent, {
      position: {
        right: '0',
        top: '0'
      },
      height: '100%',
      width: '50%',
      autoFocus: true,
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'slide-in-dialog'
    }).afterClosed().subscribe((result) => {
      document.body.classList.remove('dialog-open');
      if (result === true) {
        this.isLoggedIn.set(true);
        localStorage.setItem('is_logged_in', 'true');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('base_role');
    this.isLoggedIn.set(false);
    this.router.navigate(['/home']);
  }

}
