import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { InnovationDocumentsService } from '../services/innovation-documents.service';

export const innovationDocumentDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<null | { id: null | string; name: string }> => {
  const router: Router = inject(Router);
  const innovationDocumentsService: InnovationDocumentsService = inject(InnovationDocumentsService);

  return innovationDocumentsService.getDocumentInfo(route.params.innovationId, route.params.documentId).pipe(
    map(response => ({
      id: response.id,
      name: response.name
    })),
    catchError(() => {
      router.navigateByUrl('error/generic');
      return of(null);
    })
  );
};
