import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { getSectionTitle } from '@modules/stores/innovation/innovation.config';


@Injectable()
export class InnovationSectionDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {

    return of({
      id: route.params['sectionId'],
      name: getSectionTitle(route.params['sectionId'])
    });

  }

}
