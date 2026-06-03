import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SamitiItem } from './home.models';

// ── Mock catalogue — replace each method body with a real HTTP call ────────────
const MOCK_CATALOGUE: SamitiItem[] = [

  // ── Groups ──────────────────────────────────────────────────────────────────
  {
    id: 1, category: 'group', icon: '🙏',
    name: 'Sai Seva Samiti',
    description: 'Weekly satsang, prayers and seva activities for the whole community. Open to all devotees regardless of background.',
    distanceKm: 1.2, location: 'Sector 12, Noida',
    tags: ['Satsang', 'Seva', 'Weekly'], members: 142,
  },
  {
    id: 2, category: 'group', icon: '👩‍👩‍👧',
    name: 'Mahila Mandal',
    description: 'Women empowerment, welfare programs and cultural meetups held every fortnight. All women welcome.',
    distanceKm: 1.9, location: 'Sector 15, Noida',
    tags: ['Women', 'Welfare', 'Cultural'], members: 87,
  },
  {
    id: 3, category: 'group', icon: '📚',
    name: 'Bal Sanskar Kendra',
    description: 'Weekend values and culture classes for children aged 6–14. Grooming the next generation.',
    distanceKm: 1.5, location: 'Sector 22, Noida',
    tags: ['Children', 'Education', 'Weekend'], members: 65,
  },
  {
    id: 4, category: 'group', icon: '🫶',
    name: 'Vridh Seva Sangathan',
    description: 'Dedicated to care and companionship for the elderly. Monthly health check-up camps included.',
    distanceKm: 2.3, location: 'Sector 8, Noida',
    tags: ['Elderly', 'Health', 'Care'], members: 54,
  },
  {
    id: 5, category: 'group', icon: '🎭',
    name: 'Youth Cultural Group',
    description: 'Dance, drama, music and cultural competitions for youth. Annual utsav organised every Diwali.',
    distanceKm: 4.8, location: 'Indirapuram',
    tags: ['Youth', 'Culture', 'Music'], members: 118,
  },
  {
    id: 6, category: 'group', icon: '♻️',
    name: 'Swachh Samiti',
    description: 'Community cleanliness and tree-plantation drives every Sunday, in partnership with the municipal corporation.',
    distanceKm: 3.1, location: 'Sector 30, Noida',
    tags: ['Environment', 'Cleanliness', 'Sunday'], members: 39,
  },

  // ── Programs ─────────────────────────────────────────────────────────────────
  {
    id: 7, category: 'program', icon: '🧘', type: 'Yoga',
    name: 'Yoga & Wellness',
    description: 'Morning yoga sessions conducted by certified trainers. All ages and fitness levels welcome.',
    distanceKm: 0.8, location: 'Sector 10, Noida',
    tags: ['Yoga', 'Health', 'Daily'],
  },
  {
    id: 8, category: 'program', icon: '🍛', type: 'Bhandara',
    name: 'Bhandara Seva',
    description: 'Monthly free community meal open to all — no registration or invitation needed.',
    distanceKm: 3.5, location: 'Sector 18, Noida',
    tags: ['Food', 'Community', 'Monthly'],
  },
  {
    id: 9, category: 'program', icon: '🛠️', type: 'Skill',
    name: 'Skill Development Camp',
    description: 'Free vocational training for women and youth — stitching, basic computing and small business skills.',
    distanceKm: 2.1, location: 'Sector 41, Noida',
    tags: ['Skills', 'Training', 'Free'],
  },
  {
    id: 15, category: 'program', icon: '🏏', type: 'Cricket',
    name: 'Cricket Tournament',
    description: 'Inter-colony cricket tournament open to all age groups. Register your team at the samiti office.',
    distanceKm: 1.4, location: 'Sector 20, Noida',
    tags: ['Sports', 'Cricket', 'Tournament'],
  },

  // ── Events ───────────────────────────────────────────────────────────────────
  {
    id: 10, category: 'event', icon: '🎉', type: 'Cultural',
    name: 'Holi Utsav 2025',
    description: 'Grand Holi celebration with live music, organic colours and street food stalls.',
    distanceKm: 2.1, location: 'Sector 62, Noida',
    tags: ['Holi', 'Festival', 'Music'], date: 'Mar 14, 2025',
  },
  {
    id: 11, category: 'event', icon: '📿', type: 'Spiritual',
    name: 'Spiritual Discourse',
    description: 'Evening pravachan and interactive Q&A session by Swami Ji — every Sunday evening.',
    distanceKm: 6.3, location: 'Vasundhara',
    tags: ['Pravachan', 'Sunday', 'Spiritual'], date: 'Every Sunday',
  },
  {
    id: 12, category: 'event', icon: '🪔', type: 'Spiritual',
    name: 'Ram Katha Mahotsav',
    description: '7-day Ram Katha with Morari Bapu. Open for all devotees — passes required at gate.',
    distanceKm: 9.2, location: 'Ghaziabad',
    tags: ['Ram Katha', '7 Days', 'Devotional'], date: 'Apr 2–8, 2025',
  },
  {
    id: 13, category: 'event', icon: '🩸', type: 'Health',
    name: 'Blood Donation Camp',
    description: 'Quarterly blood donation drive organised by the local samiti. Join us and save lives.',
    distanceKm: 2.7, location: 'Sector 45, Noida',
    tags: ['Donation', 'Health', 'Quarterly'], date: 'Mar 22, 2025',
  },
  {
    id: 14, category: 'event', icon: '🪷', type: 'Cultural',
    name: 'Navratri Celebrations',
    description: 'Nine nights of garba, dandiya and devotional music. Registration open for all families.',
    distanceKm: 1.8, location: 'Sector 25, Noida',
    tags: ['Navratri', 'Garba', '9 Nights'], date: 'Oct 2–10, 2025',
  },
];

// ── Service ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);

  // ── Reactive state exposed to components ──────────────────────────
  readonly groups   = signal<SamitiItem[]>([]);
  readonly programs = signal<SamitiItem[]>([]);
  readonly events   = signal<SamitiItem[]>([]);
  readonly loading  = signal<boolean>(false);

  // ── Public API ────────────────────────────────────────────────────

  /** Fetches all three categories in one shot. */
  loadAll(): void {
    this.loading.set(true);
    this.fetchGroups();
    this.fetchPrograms();
    this.fetchEvents();
    this.loading.set(false);
  }

  /**
   * Groups API call.
   * TODO: swap `of(...)` for `this.http.get<SamitiItem[]>('/api/groups')`
   */
  fetchGroups(): void {
    // this.http.get<SamitiItem[]>('/api/groups')
    //   .pipe(tap(data => this.groups.set(data)))
    //   .subscribe();
    this.groups.set(MOCK_CATALOGUE.filter(i => i.category === 'group'));
  }

  /**
   * Programs API call.
   * TODO: swap `of(...)` for `this.http.get<SamitiItem[]>('/api/programs')`
   */
  fetchPrograms(): void {
    // this.http.get<SamitiItem[]>('/api/programs')
    //   .pipe(tap(data => this.programs.set(data)))
    //   .subscribe();
    this.programs.set(MOCK_CATALOGUE.filter(i => i.category === 'program'));
  }

  /**
   * Events API call.
   * TODO: swap `of(...)` for `this.http.get<SamitiItem[]>('/api/events')`
   */
  fetchEvents(): void {
    // this.http.get<SamitiItem[]>('/api/events')
    //   .pipe(tap(data => this.events.set(data)))
    //   .subscribe();
    this.events.set(MOCK_CATALOGUE.filter(i => i.category === 'event'));
  }
}
