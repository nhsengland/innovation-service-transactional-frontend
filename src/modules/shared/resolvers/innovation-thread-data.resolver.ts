import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { InnovationsService } from '../services/innovations.service';


@Injectable()
export class InnovationThreadDataResolver  {

  constructor(
    private innovationsService: InnovationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {


    return this.innovationsService.getThreadInfo(route.params.innovationId, route.params.threadId).pipe(
      map(response => {

        return {
          id: response.id,
          name: response.subject
        };

      })

    );

  }

}
