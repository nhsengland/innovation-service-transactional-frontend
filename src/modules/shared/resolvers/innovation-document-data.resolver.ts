import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

import { InnovationDocumentsService } from '../services/innovation-documents.service';


@Injectable()
export class InnovationDocumentDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private innovationDocumentsService: InnovationDocumentsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string, name: string }> {

    return this.innovationDocumentsService.getDocumentInfo(route.params.innovationId, route.params.documentId).pipe(
      map(response => ({
        id: response.id,
        name: response.name
      }))
    );

  }

}
