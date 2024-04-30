import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AnnouncementsService } from '@modules/feature-modules/admin/services/announcements.service';

export const announcementDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: string; title: string }> => {
  const announcementsService: AnnouncementsService = inject(AnnouncementsService);
  return announcementsService
    .getAnnouncementInfo(route.params.announcementId)
    .pipe(map(response => ({ id: response.id, title: response.title })));
};
