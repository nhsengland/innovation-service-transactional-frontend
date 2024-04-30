import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, map } from 'rxjs';

import { InnovationsService } from '../services/innovations.service';

export const innovationTaskDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationsService: InnovationsService = inject(InnovationsService);
  return innovationsService
    .getTaskInfo(route.params.innovationId, route.params.taskId)
    .pipe(map(response => ({ id: response.id, name: response.name })));
};
