import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const STORAGE_KEY = 'angular-visited-routes';

@Injectable({ providedIn: 'root' })
export class VisitedRoutesService {
  private readonly visitedUrls = new Set<string>();

  constructor(@Inject(PLATFORM_ID) platformId: object, router: Router) {
    if (!isPlatformBrowser(platformId)) return;

    this.loadVisitedUrls();

    router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.record(event.urlAfterRedirects);
    });
  }

  private loadVisitedUrls(): void {
    try {
      const storedUrls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      if (Array.isArray(storedUrls)) {
        storedUrls.filter((url): url is string => typeof url === 'string').forEach(url => this.visitedUrls.add(url));
      }
    } catch {
      // Ignore malformed or unavailable localStorage data during debugging.
    }
  }

  private record(url: string): void {
    if (this.visitedUrls.has(url)) return;

    this.visitedUrls.add(url);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.visitedUrls]));
    } catch {
      // Ignore unavailable or full localStorage during debugging.
    }
  }
}
