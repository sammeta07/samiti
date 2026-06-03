import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { SearchService } from '../../shared/search.service';
import { HomeService } from './home.service';
import { SamitiItem } from './home.models';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly searchService = inject(SearchService);
  private  readonly homeService  = inject(HomeService);

  // ── Filtered slices — react to both data signals and search filter ─
  readonly filteredGroups = computed<SamitiItem[]>(() => {
    const { query, distanceKm } = this.searchService.activeFilter();
    const q = query.trim().toLowerCase();
    return this.homeService.groups()
      .filter(i => i.distanceKm <= distanceKm && (!q || matches(i, q)))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  });

  readonly filteredPrograms = computed<SamitiItem[]>(() => {
    const { query, distanceKm } = this.searchService.activeFilter();
    const q = query.trim().toLowerCase();
    return this.homeService.programs()
      .filter(i => i.distanceKm <= distanceKm && (!q || matches(i, q)))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  });

  readonly filteredEvents = computed<SamitiItem[]>(() => {
    const { query, distanceKm } = this.searchService.activeFilter();
    const q = query.trim().toLowerCase();
    return this.homeService.events()
      .filter(i => i.distanceKm <= distanceKm && (!q || matches(i, q)))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  });

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.homeService.loadAll();
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function matches(item: SamitiItem, q: string): boolean {
  return (
    item.name.toLowerCase().includes(q)        ||
    item.description.toLowerCase().includes(q) ||
    item.location.toLowerCase().includes(q)    ||
    item.tags.some(t => t.toLowerCase().includes(q))
  );
}
