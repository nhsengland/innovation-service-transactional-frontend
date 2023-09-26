import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, map } from 'rxjs';

import { InnovationsService } from '../services/innovations.service';


@Injectable()
export class InnovationTaskDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(private innovationsService: InnovationsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {

    return this.innovationsService.getTaskInfo(route.params.innovationId, route.params.taskId).pipe(
      map(response => ({ id: response.id, name: response.name }))
    );

  }

}
