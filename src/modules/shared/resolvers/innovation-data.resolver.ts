import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CtxStore } from '@modules/stores';

/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */
@Injectable()
export class InnovationDataResolver {
  constructor(
    private router: Router,
    private logger: NGXLogger,
    private ctx: CtxStore
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: string; name: string }> {
    return this.ctx.innovation.getOrLoadInnovation$(route.params.innovationId, this.ctx.user.getUserContext()).pipe(
      map(response => ({ id: response.id, name: response.name })),
      catchError(error => {
        this.ctx.innovation.clear();
        this.router.navigateByUrl('error/forbidden-innovation');
        this.logger.error('Error fetching data innovation data', error);
        return of(null);
      })
    );
  }
}
