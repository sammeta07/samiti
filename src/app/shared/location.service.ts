import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface LocationCoords {
  lat: number;
  long: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';

  private http         = inject(HttpClient);
  private destroyRef   = inject(DestroyRef);

  userLocationCords$ = signal<LocationCoords | null>(null);
  userLocationName$  = signal<string>('');   // empty = still loading

  constructor() {
    this.detectLocation();
  }

  // ── Geolocation ────────────────────────────────────────────────
  async detectLocation(): Promise<void> {
    try {
      const pos = await this.getGeolocation();
      this.userLocationCords$.set(pos);

      this.reverseGeocode(pos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next:  name  => this.userLocationName$.set(name),
          error: ()    => this.userLocationName$.set('Location unavailable'),
        });
    } catch {
      this.userLocationName$.set('Location denied');
    }
  }

  private getGeolocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resp => resolve({ lat: resp.coords.latitude, long: resp.coords.longitude }),
        err  => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // ── Reverse Geocoding (Nominatim) ──────────────────────────────
  reverseGeocode(coord: LocationCoords): Observable<string> {
    const params = {
      format: 'json',
      lat:    coord.lat.toString(),
      lon:    coord.long.toString(),
      zoom:   '10',
    };

    return this.http.get<any>(this.REVERSE_GEOCODING_API, { params }).pipe(
      map(data => {
        const address = data?.address ?? {};
        return (
          address.state_district ||
          address.city_district  ||
          address.city           ||
          address.town           ||
          address.village        ||
          address.state          ||
          'Unknown location'
        );
      }),
      catchError(() => of('Location unavailable'))
    );
  }

  // ── Distance Utilities ─────────────────────────────────────────
  getDistanceFromUser(target: LocationCoords): string {
    const user = this.userLocationCords$();
    if (!user) return 'Calculating...';
    const km = this.haversineKm(user, target);
    return km >= 1
      ? `${km.toFixed(1)} km from you`
      : `${Math.round(km * 1000)} m from you`;
  }

  private haversineKm(a: LocationCoords, b: LocationCoords): number {
    const R    = 6371;
    const dLat = this.rad(b.lat  - a.lat);
    const dLon = this.rad(b.long - a.long);
    const x    = Math.sin(dLat / 2) ** 2 +
                 Math.cos(this.rad(a.lat)) * Math.cos(this.rad(b.lat)) *
                 Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  private rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
