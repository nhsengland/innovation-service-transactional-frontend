import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AnnouncementsService } from '@modules/feature-modules/admin/services/announcements.service';

@Injectable()
export class AnnouncementDataResolver {
  constructor(private announcementsService: AnnouncementsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: string; title: string }> {
    return this.announcementsService
      .getAnnouncementInfo(route.params.announcementId)
      .pipe(map(response => ({ id: response.id, title: response.title })));
  }
}
