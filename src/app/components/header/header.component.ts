import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocationService } from '../../shared/location.service';
import { SearchService } from '../../shared/search.service';

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
export class HeaderComponent {
  private locationService = inject(LocationService);
  private searchService   = inject(SearchService);

  @ViewChild('pillInput') pillInput!: ElementRef<HTMLInputElement>;

  // Location state
  userLocationName  = this.locationService.userLocationName$;
  userLocationCords = this.locationService.userLocationCords$;

  // Search state — backed by global SearchService
  searchQuery     = this.searchService.query;
  isSearchFocused = false;

  retryLocation(): void {
    this.locationService.detectLocation();
  }

  onSearch(event: Event): void {
    this.searchService.setQuery((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchService.setQuery('');
    this.pillInput?.nativeElement.focus();
  }
}
