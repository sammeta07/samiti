import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly searchService = inject(SearchService);
  private  readonly homeService  = inject(HomeService);

  // Track which group panel index is expanded (0 = first panel open by default)
  readonly expandedGroupIndex = signal<number | null>(0);

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

  readonly currentYear = new Date().getFullYear();
  readonly yearTabs = [
    this.currentYear + 1,
    this.currentYear,
    this.currentYear - 1,
    this.currentYear - 2,
  ];

  getEventsForYear(year: number): SamitiItem[] {
    return this.filteredEvents().filter(event => this.getEventYear(event) === year);
  }

  private getEventYear(event: SamitiItem): number | null {
    if (!event.date) return null;
    const match = /\b(20\d{2})\b/.exec(event.date);
    return match ? Number(match[1]) : null;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.homeService.loadAll();
  }

  // ── Expansion Panel Handlers ───────────────────────────────────────
  scrollGroupsToTop(): void {
    // Wait for the expansion animation to finish, then align the opened panel
    setTimeout(() => {
      const container = document.querySelector('.groups-scroll') as HTMLElement | null;
      if (!container) return;

      const panels = Array.from(container.querySelectorAll<HTMLElement>('.group-panel'));
      const idx = this.expandedGroupIndex();
      if (idx === null || idx < 0 || idx >= panels.length) {
        container.scrollTop = 0;
        return;
      }

      const first = panels[0];
      const target = panels[idx];
      if (!first || !target) {
        container.scrollTop = 0;
        return;
      }

      // Compute distance between target top and first panel top, then scroll container by that amount
      const offset = target.offsetTop - first.offsetTop;
      container.scrollTo({ top: offset, behavior: 'smooth' });
    }, 220);
  }

  scrollProgramsToTop(): void {
    // For symmetry; scrolls sidebar container to top after small delay
    setTimeout(() => {
      const scrollContainer = document.querySelector('.sidebar-scroll') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    }, 50);
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
