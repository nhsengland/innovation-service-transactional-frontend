import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, map } from 'rxjs';

import { InnovationStore } from '@modules/stores/innovation/innovation.store';

import { irVersionsClinicalMainCategoryItems } from '@modules/stores/innovation/innovation-record/ir-versions.config';

export const innovationSectionEvidenceDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<null | { id: string; name: string }> => {
  const innovationStore: InnovationStore = inject(InnovationStore);

  return innovationStore.getSectionEvidence$(route.params['innovationId'], route.params['evidenceId']).pipe(
    map(response => {
      return {
        id: route.params['evidenceId'] as string,
        name:
          response.description ||
          irVersionsClinicalMainCategoryItems.find(e => e.value === response.clinicalEvidenceType)?.label ||
          ''
      };
    })
  );
};
