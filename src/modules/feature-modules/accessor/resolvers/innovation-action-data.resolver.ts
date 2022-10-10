import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AccessorService } from '../services/accessor.service';


@Injectable()
export class InnovationActionDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private accessorService: AccessorService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {

    return this.accessorService.getInnovationActionInfo(route.params.innovationId, route.params.actionId).pipe(
      map(response => {

        return {
          id: response.id,
          name: response.name
        };

      })

    );

  }

}
