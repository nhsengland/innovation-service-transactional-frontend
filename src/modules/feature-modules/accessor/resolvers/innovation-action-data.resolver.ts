import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, map } from 'rxjs';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Injectable()
export class InnovationActionDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private innovationsService: InnovationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {

    return this.innovationsService.getActionInfo(route.params.innovationId, route.params.taskId).pipe(
      map(response => {

        return {
          id: response.id,
          name: response.name
        };

      })

    );

  }

}
