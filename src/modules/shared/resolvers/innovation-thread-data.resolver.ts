import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { map, Observable } from 'rxjs';

import { InnovationsService } from '../services/innovations.service';

export const innovationThreadDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationsService: InnovationsService = inject(InnovationsService);

  return innovationsService.getThreadInfo(route.params.innovationId, route.params.threadId).pipe(
    map(response => {
      return {
        id: response.id,
        name: response.subject
      };
    })
  );
};
