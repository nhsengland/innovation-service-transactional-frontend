import { Injectable, inject } from '@angular/core';

import { InnovationContextStore } from './innovation/innovation-context.store';
import { AssessmentContextStore } from './assessment/assessment-context.store';

@Injectable()
export class CtxStore {
  readonly innovation: InnovationContextStore;
  readonly assessment: AssessmentContextStore;

  constructor() {
    this.innovation = inject(InnovationContextStore);
    this.assessment = inject(AssessmentContextStore);
  }
}
