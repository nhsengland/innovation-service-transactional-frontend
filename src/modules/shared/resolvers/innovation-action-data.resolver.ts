import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { InnovationsService } from '../services/innovations.service';


@Injectable()
export class InnovationActionDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private innovationsService: InnovationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {


    return this.innovationsService.getTaskInfo(route.params.innovationId, route.params.actionId).pipe(
      map(response => {

        return {
          id: response.id,
          name: response.name,
        };

      })

    );

  }

}
