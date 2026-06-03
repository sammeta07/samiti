import { Injectable, signal, computed } from '@angular/core';

export interface SearchFilter {
  query:      string;
  distanceKm: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {

  // ── Writable state ────────────────────────────────────────────────
  readonly query      = signal<string>('');
  readonly distanceKm = signal<number>(5);

  // ── Derived state ─────────────────────────────────────────────────
  readonly activeFilter = computed<SearchFilter>(() => ({
    query:      this.query(),
    distanceKm: this.distanceKm(),
  }));

  readonly hasActiveFilter = computed<boolean>(() =>
    this.query().trim().length > 0 || this.distanceKm() !== 5
  );

  // ── Mutators ──────────────────────────────────────────────────────
  setQuery(q: string): void      { this.query.set(q); }
  setDistance(km: number): void  { this.distanceKm.set(km); }
  clearAll(): void               { this.query.set(''); this.distanceKm.set(5); }
}
