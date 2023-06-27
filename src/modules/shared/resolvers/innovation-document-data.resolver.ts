import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { InnovationDocumentsService } from '../services/innovation-documents.service';


@Injectable()
export class InnovationDocumentDataResolver implements Resolve<null | { id: null | string, name: string }> {

  constructor(
    private router: Router,
    private innovationDocumentsService: InnovationDocumentsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: null | string, name: string }> {

    return this.innovationDocumentsService.getDocumentInfo(route.params.innovationId, route.params.documentId).pipe(
      map(response => ({
        id: response.id,
        name: response.name
      })),
      catchError(() => {
        this.router.navigateByUrl('error/generic');
        return of(null);
      })
    );

  }

}
